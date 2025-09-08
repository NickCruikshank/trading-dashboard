'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

/** ---------- small helpers ---------- */

type Trade = {
  id: number
  ticker: string
  side: 'Long' | 'Short'
  type: 'Stock' | 'Call' | 'Put'
  qty: number
  entryPrice: number
  lastPrice?: number | null
  status: 'Open' | 'Closed'
}

function Stat(props: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  const { label, value, sub } = props
  return (
    <div className="rounded-xl border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
      {sub ? <div className="text-xs text-muted-foreground mt-1">{sub}</div> : null}
    </div>
  )
}

/** mock equity curve so the chart shows something */
const mockEquity = [
  { day: 'Mon', pnl: -120 },
  { day: 'Tue', pnl: 240 },
  { day: 'Wed', pnl: 180 },
  { day: 'Thu', pnl: 260 },
  { day: 'Fri', pnl: 720 },
]

export default function Home() {
  /** ------- position size (stock) ------- */
  const [acct, setAcct] = useState<number>(25000)
  const [riskPct, setRiskPct] = useState<number>(1) // 1% risk
  const [entry, setEntry] = useState<number>(50)
  const [stop, setStop] = useState<number>(48)
  const [target, setTarget] = useState<number>(54)

  const riskPerShare = useMemo(() => Math.max(entry - stop, 0), [entry, stop])
  const totalRisk = useMemo(() => (acct * (riskPct / 100)), [acct, riskPct])
  const positionSize = useMemo(() => (riskPerShare > 0 ? Math.floor(totalRisk / riskPerShare) : 0), [totalRisk, riskPerShare])
  const rr = useMemo(() => {
    const reward = Math.max(target - entry, 0)
    return riskPerShare > 0 ? (reward / riskPerShare).toFixed(2) : '0.00'
  }, [entry, target, riskPerShare])

  /** ------- options calc (very light – no IV/Greeks yet) ------- */
  const [optType, setOptType] = useState<'Call' | 'Put'>('Call')
  const [strike, setStrike] = useState<number>(50)
  const [premium, setPremium] = useState<number>(1.25)
  const [contracts, setContracts] = useState<number>(1)
  const [targetSpot, setTargetSpot] = useState<number>(54)
  const [stopSpot, setStopSpot] = useState<number>(48)

  const breakeven = useMemo(() => {
    return optType === 'Call' ? strike + premium : strike - premium
  }, [optType, strike, premium])

  const maxLoss = useMemo(() => Math.max(contracts * 100 * premium, 0), [contracts, premium])

  function intrinsicAt(spot: number) {
    const callIntr = Math.max(spot - strike, 0)
    const putIntr = Math.max(strike - spot, 0)
    const intrinsic = optType === 'Call' ? callIntr : putIntr
    // rough mark-to-value for 1 contract lot
    return intrinsic * 100 * contracts - maxLoss
  }

  const estPL = useMemo(() => {
    return {
      pnlTarget: intrinsicAt(targetSpot),
      pnlStop: intrinsicAt(stopSpot),
    }
  }, [targetSpot, stopSpot, contracts, strike, premium, optType])

  /** ------- trades (best‑effort fetch; will work once you deploy the API) ------- */
  const [trades, setTrades] = useState<Trade[]>([])
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch('/api/trades', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (alive && Array.isArray(data)) {
          setTrades(
            data.map((t: any, i: number) => ({
              id: t.id ?? i + 1,
              ticker: String(t.ticker ?? 'TBD'),
              side: (t.side ?? 'Long') as Trade['side'],
              type: (t.type ?? 'Stock') as Trade['type'],
              qty: Number(t.qty ?? 0),
              entryPrice: Number(t.entryPrice ?? 0),
              lastPrice: t.lastPrice ?? null,
              status: (t.status ?? 'Open') as Trade['status'],
            }))
          )
        }
      } catch {
        // ignore if API isn't wired yet
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trading Dashboard</h1>
        <div className="text-sm text-muted-foreground">Local prototype — calculators & mock chart</div>
      </div>

      {/* equity curve */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-2 text-sm font-medium">Equity (mock)</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockEquity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="pnl" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* ---------- Stock R/R & Position Size ---------- */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="text-sm font-semibold">Stock R/R & Position Size</div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Account ($)</Label>
                <Input type="number" value={acct} onChange={(e) => setAcct(Number(e.target.value))} />
              </div>
              <div>
                <Label>Risk %</Label>
                <Input type="number" value={riskPct} onChange={(e) => setRiskPct(Number(e.target.value))} />
              </div>
              <div>
                <Label>Entry</Label>
                <Input type="number" value={entry} onChange={(e) => setEntry(Number(e.target.value))} />
              </div>
              <div>
                <Label>Stop</Label>
                <Input type="number" value={stop} onChange={(e) => setStop(Number(e.target.value))} />
              </div>
              <div>
                <Label>Target</Label>
                <Input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Stat label="R:R" value={String(rr)} />
              <Stat label="# Shares" value={String(positionSize)} sub={`Risk ~$${(acct * (riskPct / 100)).toFixed(0)}`} />
              <Stat label="Risk/Share" value={`$${(entry - stop).toFixed(2)}`} />
            </div>
          </CardContent>
        </Card>

        {/* ---------- Options Calculator (simple) ---------- */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="text-sm font-semibold">Options Calculator (simple)</div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Type</Label>
                <select
                  className="border rounded-md h-9 px-2 w-full bg-background"
                  value={optType}
                  onChange={(e) => setOptType(e.target.value as 'Call' | 'Put')}
                >
                  <option>Call</option>
                  <option>Put</option>
                </select>
              </div>
              <div>
                <Label>Strike</Label>
                <Input type="number" value={strike} onChange={(e) => setStrike(Number(e.target.value))} />
              </div>
              <div>
                <Label>Premium</Label>
                <Input type="number" step="0.01" value={premium} onChange={(e) => setPremium(Number(e.target.value))} />
              </div>
              <div>
                <Label>Contracts</Label>
                <Input type="number" value={contracts} onChange={(e) => setContracts(Number(e.target.value))} />
              </div>
              <div>
                <Label>Target Spot</Label>
                <Input type="number" value={targetSpot} onChange={(e) => setTargetSpot(Number(e.target.value))} />
              </div>
              <div>
                <Label>Stop Spot</Label>
                <Input type="number" value={stopSpot} onChange={(e) => setStopSpot(Number(e.target.value))} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Stat
                label="Breakeven"
                value={`$${breakeven.toFixed(2)}`}
                sub={optType === 'Call' ? 'Strike + Premium' : 'Strike - Premium'}
              />
              <Stat label="Max Loss" value={`$${maxLoss.toFixed(0)}`} sub={`${contracts}x100 * Premium`} />
              <Stat label="Est. P/L @ Target" value={`$${estPL.pnlTarget.toFixed(0)}`} sub={`@ ${targetSpot}`} />
            </div>

            <div className="text-xs text-muted-foreground">
              Note: This simple model ignores time/IV. We can wire in IV & Greeks next.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ---------- Trades table (best-effort) ---------- */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold">Trades</div>
            <Button
              variant="outline"
              onClick={() => {
                // quick client refresh
                location.reload()
              }}
            >
              Refresh
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Entry</TableHead>
                  <TableHead className="text-right">Last</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.length === 0 && (
  <tr>
    <td colSpan={7} className="text-center text-muted-foreground px-4 py-3">
      No trades yet (or API not running). You can add seeding later.
    </td>
  </tr>
)}

                {trades.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.ticker}</TableCell>
                    <TableCell>{t.side}</TableCell>
                    <TableCell>{t.type}</TableCell>
                    <TableCell className="text-right">{t.qty}</TableCell>
                    <TableCell className="text-right">${t.entryPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      {t.lastPrice != null ? `$${Number(t.lastPrice).toFixed(2)}` : '—'}
                    </TableCell>
                    <TableCell>{t.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
