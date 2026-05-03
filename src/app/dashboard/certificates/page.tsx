"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Certificate = {
  id: string
  company_id: string
  status: string
  ai_confidence: number | null
  created_at: string
}

export default function CertificatesPage() {
  const [items, setItems] = useState<Certificate[]>([])
  const [error, setError] = useState("")

  async function load() {
    api.get<Certificate[]>("/api/v1/admin/certificates/pending")
      .then(setItems)
      .catch((e) => setError(e.message))
  }

  useEffect(() => { load() }, [])

  async function review(id: string, action: "approve" | "reject") {
    try {
      await api.post(`/api/v1/admin/certificates/${id}/review`, { action })
      load()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed")
    }
  }

  function confidenceBadge(score: number | null) {
    if (score === null) return <Badge variant="secondary">—</Badge>
    const pct = Math.round(score * 100)
    return (
      <Badge variant={score >= 0.92 ? "default" : "outline"}>
        {pct}%
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Certificates</h1>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>AI confidence</TableHead>
            <TableHead>Date</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-mono text-xs">{c.company_id.slice(0, 8)}…</TableCell>
              <TableCell><Badge variant="outline">{c.status}</Badge></TableCell>
              <TableCell>{confidenceBadge(c.ai_confidence)}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(c.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button size="sm" onClick={() => review(c.id, "approve")}>Approve</Button>
                <Button size="sm" variant="destructive" onClick={() => review(c.id, "reject")}>Reject</Button>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && !error && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No pending certificates
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
