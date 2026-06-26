"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import { Plus, Trash2, Printer, Loader2, TableProperties, Eye, X } from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import toast from "react-hot-toast";

interface Table {
  _id: string;
  tableNumber: string;
  seatingCapacity: number;
  status: "available" | "occupied" | "reserved";
}

interface QRCode {
  _id: string;
  tableId: string;
  qrCodeUrl: string;
}

export default function TablesPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [seatingCapacity, setSeatingCapacity] = useState(2);
  const [viewingTable, setViewingTable] = useState<{ number: string; qrUrl: string } | null>(null);

  // Queries
  const { data: response, isLoading } = useQuery<{ success: boolean; tables: Table[]; qrcodes: QRCode[]; restaurantName?: string }>({
    queryKey: ["admin", "tables"],
    queryFn: () => apiFetch("/api/admin/tables"),
  });

  const tables = response?.tables || [];
  const qrcodes = response?.qrcodes || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) =>
      apiFetch("/api/admin/tables", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      toast.success("Table and QR code created!");
      queryClient.invalidateQueries({ queryKey: ["admin", "tables"] });
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create table");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/admin/tables?id=${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      toast.success("Table deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "tables"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete table");
    },
  });

  const resetForm = () => {
    setTableNumber("");
    setSeatingCapacity(2);
    setShowModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber) return;
    createMutation.mutate({ tableNumber, seatingCapacity });
  };

  const handleDelete = (id: string) => {
    if (confirm("Deactivating this table will delete its associated QR Code. Continue?")) {
      deleteMutation.mutate(id);
    }
  };

  const handlePrint = (qrUrl: string, tNum: string) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const restName = response?.restaurantName || "Our Restaurant";

    printWindow.document.write(`
      <html>
        <head>
          <title>Table ${tNum} QR Code</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800;900&display=swap');
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              font-family: 'Outfit', sans-serif;
              background-color: #ffffff;
              color: #0f172a;
            }
            .container {
              border: 4px solid #ea580c;
              border-radius: 28px;
              padding: 50px 40px;
              text-align: center;
              width: 380px;
              box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
              background: radial-gradient(circle at top left, #fff 60%, #fff7ed 100%);
              display: flex;
              flex-direction: column;
              align-items: center;
              box-sizing: border-box;
            }
            .restaurant-name {
              font-size: 18px;
              font-weight: 800;
              color: #64748b;
              letter-spacing: 0.15em;
              margin-bottom: 12px;
              text-transform: uppercase;
              font-family: 'Outfit', sans-serif;
            }
            .badge {
              background-color: #ea580c;
              color: #ffffff;
              font-size: 30px;
              font-weight: 900;
              padding: 8px 28px;
              border-radius: 9999px;
              letter-spacing: 0.05em;
              box-shadow: 0 4px 10px rgba(234, 88, 12, 0.2);
              display: inline-block;
              margin-bottom: 20px;
            }
            .divider {
              width: 50px;
              height: 4px;
              background-color: #fdba74;
              border-radius: 2px;
              margin-bottom: 20px;
            }
            .instruction {
              font-size: 22px;
              font-weight: 800;
              color: #0f172a;
              margin-bottom: 15px;
            }
            .qr-container {
              padding: 12px;
              background: #ffffff;
              border: 2px solid #e2e8f0;
              border-radius: 20px;
              box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
              margin-bottom: 20px;
            }
            .qr-container img {
              width: 220px;
              height: 220px;
              display: block;
            }
            .sub-instruction {
              font-size: 12px;
              color: #64748b;
              max-width: 260px;
              line-height: 1.5;
              margin-bottom: 20px;
              font-weight: 500;
            }
            .footer {
              font-size: 10px;
              color: #cbd5e1;
              font-weight: 650;
              text-transform: uppercase;
              letter-spacing: 0.1em;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="restaurant-name">${restName.toUpperCase()}</div>
            <div class="badge">TABLE ${tNum}</div>
            <div class="divider"></div>
            <div class="instruction">Scan QR Code to Order</div>
            <div class="qr-container">
              <img src="${qrUrl}" alt="Table QR" />
            </div>
            <div class="sub-instruction">Browse menu, customize items & pay directly from your phone</div>
            <div class="footer">Powered by Restro SaaS</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => { window.close(); }, 100);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePrintAll = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const restName = response?.restaurantName || "Our Restaurant";
    
    let cardsHtml = "";
    tables.forEach((table) => {
      const qr = qrcodes.find((q) => q.tableId === table._id);
      if (qr?.qrCodeUrl) {
        cardsHtml += `
          <div class="table-card">
            <div class="container">
              <div class="restaurant-name">${restName.toUpperCase()}</div>
              <div class="badge">TABLE ${table.tableNumber}</div>
              <div class="divider"></div>
              <div class="instruction">Scan QR Code to Order</div>
              <div class="qr-container">
                <img src="${qr.qrCodeUrl}" alt="Table QR" />
              </div>
              <div class="sub-instruction">Browse menu, customize items & pay directly from your phone</div>
              <div class="footer">Powered by Restro SaaS</div>
            </div>
          </div>
        `;
      }
    });

    printWindow.document.write(`
      <html>
        <head>
          <title>All Table QR Codes - ${restName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800;900&display=swap');
            body {
              margin: 0;
              padding: 0;
              font-family: 'Outfit', sans-serif;
              background-color: #ffffff;
              color: #0f172a;
            }
            .table-card {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              box-sizing: border-box;
              page-break-after: always;
            }
            .table-card:last-child {
               page-break-after: avoid;
            }
            .container {
              border: 4px solid #ea580c;
              border-radius: 28px;
              padding: 50px 40px;
              text-align: center;
              width: 380px;
              box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
              background: radial-gradient(circle at top left, #fff 60%, #fff7ed 100%);
              display: flex;
              flex-direction: column;
              align-items: center;
              box-sizing: border-box;
            }
            .restaurant-name {
              font-size: 18px;
              font-weight: 800;
              color: #64748b;
              letter-spacing: 0.15em;
              margin-bottom: 12px;
              text-transform: uppercase;
            }
            .badge {
              background-color: #ea580c;
              color: #ffffff;
              font-size: 30px;
              font-weight: 900;
              padding: 8px 28px;
              border-radius: 9999px;
              letter-spacing: 0.05em;
              box-shadow: 0 4px 10px rgba(234, 88, 12, 0.2);
              display: inline-block;
              margin-bottom: 20px;
            }
            .divider {
              width: 50px;
              height: 4px;
              background-color: #fdba74;
              border-radius: 2px;
              margin-bottom: 20px;
            }
            .instruction {
              font-size: 22px;
              font-weight: 800;
              color: #0f172a;
              margin-bottom: 15px;
            }
            .qr-container {
              padding: 12px;
              background: #ffffff;
              border: 2px solid #e2e8f0;
              border-radius: 20px;
              box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
              margin-bottom: 20px;
            }
            .qr-container img {
              width: 220px;
              height: 220px;
              display: block;
            }
            .sub-instruction {
              font-size: 12px;
              color: #64748b;
              max-width: 260px;
              line-height: 1.5;
              margin-bottom: 20px;
              font-weight: 500;
            }
            .footer {
              font-size: 10px;
              color: #cbd5e1;
              font-weight: 650;
              text-transform: uppercase;
              letter-spacing: 0.1em;
            }
            @media print {
              body {
                background-color: #ffffff;
              }
              .table-card {
                height: 100vh;
              }
            }
          </style>
        </head>
        <body>
          ${cardsHtml}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => { window.close(); }, 100);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Tables & QR Codes</h1>
          <p className="text-slate-400 mt-1">Manage restaurant seating zones and generate custom order QR templates.</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-orange-500/10"
        >
          <Plus className="h-4 w-4" />
          Add Table
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {tables.map((table) => {
            const qr = qrcodes.find((q) => q.tableId === table._id);
            return (
              <Card
                key={table._id}
                className="bg-slate-900/20 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between items-center text-center relative hover:border-slate-700/80 transition-all duration-200"
              >
                <div className="space-y-3.5 w-full">
                  <div className="flex justify-between items-start w-full">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        table.status === "available"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : table.status === "occupied"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}
                    >
                      {table.status}
                    </span>
                    <button
                      onClick={() => handleDelete(table._id)}
                      className="text-slate-500 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/5 text-orange-500 border border-orange-500/10">
                    <TableProperties className="h-7 w-7" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">Table {table.tableNumber}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Seating capacity: {table.seatingCapacity}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 w-full pt-4 border-t border-slate-900">
                  {qr?.qrCodeUrl ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => setViewingTable({ number: table.tableNumber, qrUrl: qr.qrCodeUrl })}
                        className="bg-slate-900 border border-slate-850 hover:bg-slate-850 text-slate-300 text-xs flex-1 py-1.5 flex items-center justify-center gap-1.5"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handlePrint(qr.qrCodeUrl, table.tableNumber)}
                        className="bg-orange-600 hover:bg-orange-700 text-white text-xs flex-1 py-1.5 flex items-center justify-center gap-1.5"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        Print Sign
                      </Button>
                    </>
                  ) : (
                    <span className="text-[10px] text-slate-500">QR generation pending</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Bulk action print bar */}
      {!isLoading && tables.length > 0 && (
        <div className="flex justify-center pt-8 border-t border-slate-900">
          <Button
            onClick={handlePrintAll}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-orange-500/10 flex items-center gap-2 transition-transform active:scale-[0.98]"
          >
            <Printer className="h-5 w-5" />
            Print All Table Signs (${tables.length} Tables)
          </Button>
        </div>
      )}

      {/* Add Table Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-850">
              <h2 className="text-xl font-bold text-white">Add Dining Table</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Table Number / Label *"
                type="text"
                placeholder="T-12 or 12"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                required
              />

              <Input
                label="Seating Capacity *"
                type="number"
                placeholder="4"
                min={1}
                value={seatingCapacity}
                onChange={(e) => setSeatingCapacity(Number(e.target.value))}
                required
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-850">
                <Button
                  type="button"
                  onClick={resetForm}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold flex items-center gap-2"
                >
                  {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Table
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View QR Code Modal overlay */}
      {viewingTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-850/85 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 relative animate-in fade-in-50 zoom-in-95 duration-150 text-center space-y-5">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setViewingTable(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="pt-2 text-center space-y-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                  {response?.restaurantName || "Our Restaurant"}
                </p>
                <h3 className="text-2xl font-black text-white mt-1">TABLE {viewingTable.number}</h3>
              </div>
              
              <div className="bg-white p-4 rounded-2xl inline-block shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={viewingTable.qrUrl} alt="Preview QR" className="h-56 w-56 mx-auto" />
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-200">Scan QR to Order</p>
                <p className="text-xs text-slate-400 max-w-[240px] mx-auto leading-relaxed">
                  Browse the menu, select your dishes and place orders directly from your phone.
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => handlePrint(viewingTable.qrUrl, viewingTable.number)}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/10"
              >
                <Printer className="h-4 w-4" />
                Print Sign
              </Button>
              <Button
                onClick={() => setViewingTable(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
