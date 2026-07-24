'use client'

import { useState } from 'react'
import { Copy, Download, Check, Users } from 'lucide-react'

interface Customer {
  id: string
  name: string | null
  country_code: string
  phone: string
  created_at: string
}

interface CustomersListProps {
  customers: Customer[]
}

export function CustomersList({ customers }: CustomersListProps) {
  const [copied, setCopied] = useState(false)

  function formatFullPhone(country_code: string, phone: string) {
    return `${country_code}${phone}`
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('es-PA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function handleCopyNumbers() {
    const numbers = customers.map(c => formatFullPhone(c.country_code, c.phone)).join('\n')
    navigator.clipboard.writeText(numbers)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleExportCSV() {
    const headers = ['Nombre', 'Telefono', 'Fecha de Registro']
    const rows = customers.map(c => [
      `"${c.name || 'Sin nombre'}"`,
      `"${formatFullPhone(c.country_code, c.phone)}"`,
      `"${formatDate(c.created_at)}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `clientes_vip_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (customers.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
        <div className="w-12 h-12 bg-zinc-100 text-zinc-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users size={24} />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 mb-1">Aún no tienes clientes registrados</h3>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto">
          El widget del Club VIP aparecerá automáticamente en tu menú público para que tus visitantes se registren.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Top Bar Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-zinc-200">
        <div className="text-sm font-medium text-zinc-700">
          Total capturados: <span className="font-bold text-zinc-900">{customers.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyNumbers}
            className="flex items-center gap-1.5 text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-3 py-2 rounded-lg transition-colors"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            {copied ? '¡Copiados!' : 'Copiar números para WhatsApp'}
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg transition-colors"
          >
            <Download size={14} />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Fecha de Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-4 py-3.5 font-medium text-zinc-900">
                    {c.name || <span className="text-zinc-400 font-normal">Sin nombre</span>}
                  </td>
                  <td className="px-4 py-3.5 text-zinc-700 font-mono text-xs">
                    {formatFullPhone(c.country_code, c.phone)}
                  </td>
                  <td className="px-4 py-3.5 text-zinc-500 text-xs whitespace-nowrap">
                    {formatDate(c.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
