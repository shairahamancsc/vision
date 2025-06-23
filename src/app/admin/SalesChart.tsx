"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { monthlySales } from "@/lib/data"

export function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={monthlySales}>
        <XAxis
          dataKey="month"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value / 100000}L`}
        />
        <Tooltip
            contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
            }}
            formatter={(value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            itemStyle={{ color: "hsl(var(--primary))" }}
            cursor={{fill: 'hsl(var(--accent))'}}
        />
        <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
