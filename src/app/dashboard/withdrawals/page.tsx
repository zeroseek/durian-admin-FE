"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Withdrawal = {
  id: string
  user_id: string
  amount: string
  currency: string
  status: string
  created_at: string
}

export default function WithdrawalsPage() {
  const [items, setItems] = useState<Withdrawal[]>([])
  const [error, setError] = useState("")

  async function load() {
    api.get<Withdrawal[]>("/api/v1/admin/withdrawals/pending-review")
      .then(setItems)
      .catch((e) => setError(e.message))
  }

  useEffect(() => { load() }, [])

  async function approveStage1(id: string) {
    try {
      await api.post(`/api/v1/admin/withdrawals/${id}/approve`, {})
      load()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed")
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Pending Withdrawals</h1>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((w) => (
            <TableRow key={w.id}>
              <TableCell className="font-mono text-xs">{w.user_id.slice(0, 8)}…</TableCell>
              <TableCell>{w.amount} {w.currency}</TableCell>
              <TableCell><Badge variant="outline">{w.status}</Badge></TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(w.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {w.status === "pending" && (
                  <Button size="sm" onClick={() => approveStage1(w.id)}>Stage 1 Approve</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && !error && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No pending withdrawals
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
