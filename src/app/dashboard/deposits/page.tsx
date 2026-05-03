"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Deposit = {
  id: string
  user_id: string
  amount: string
  currency: string
  provider: string
  status: string
  created_at: string
}

export default function DepositsPage() {
  const [items, setItems] = useState<Deposit[]>([])
  const [error, setError] = useState("")

  async function load() {
    api.get<Deposit[]>("/api/v1/admin/deposits/pending")
      .then(setItems)
      .catch((e) => setError(e.message))
  }

  useEffect(() => { load() }, [])

  async function approve(id: string) {
    try {
      await api.post(`/api/v1/admin/deposits/${id}/approve`, {})
      load()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed")
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Pending Deposits</h1>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((d) => (
            <TableRow key={d.id}>
              <TableCell className="font-mono text-xs">{d.user_id.slice(0, 8)}…</TableCell>
              <TableCell>{d.amount} {d.currency}</TableCell>
              <TableCell>{d.provider}</TableCell>
              <TableCell><Badge variant="outline">{d.status}</Badge></TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(d.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {d.status === "pending" && (
                  <Button size="sm" onClick={() => approve(d.id)}>Approve</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && !error && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No pending deposits
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
