"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type User = {
  id: string
  uidt: string
  username: string
  full_name: string
  role: string
  phone: string | null
  is_active: boolean
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    api.get<User[]>("/api/v1/admin/users")
      .then(setUsers)
      .catch((e) => setError(e.message))
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Users</h1>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>UIDT</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Full name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell className="font-mono text-xs">{u.uidt}</TableCell>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.full_name}</TableCell>
              <TableCell>
                <Badge variant="outline">{u.role}</Badge>
              </TableCell>
              <TableCell>{u.phone ?? "—"}</TableCell>
              <TableCell>
                <Badge variant={u.is_active ? "default" : "secondary"}>
                  {u.is_active ? "active" : "inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && !error && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No users yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
