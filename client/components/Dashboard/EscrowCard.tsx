import React from "react";

export type EscrowStatus = "Created" | "Funded" | "Occupied" | "Completed";

export interface EscrowCardProps {
  escrowId: string;
  status: EscrowStatus;
  amount: number;
}

export function EscrowCard({ escrowId, status, amount }: EscrowCardProps) {
  return (
    <div className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm flex flex-col space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-500 font-medium">Escrow ID</p>
          <p className="font-mono text-sm">{escrowId}</p>
        </div>
        
        {/* 
          TODO: [Wave Contributor] 
          Implement status visualization (e.g., colored badges or progress indicator)
          based on the current EscrowStatus prop.
        */}
        <div className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded font-semibold">
          {status}
        </div>
      </div>

      <div>
        <p className="text-sm text-slate-500 font-medium">Rent Amount</p>
        {/* 
          TODO: [Wave Contributor]
          Format this amount properly based on local currency equivalents,
          even though it is held as USDC underneath. 
        */}
        <p className="text-2xl font-bold">${amount.toLocaleString()}</p>
      </div>

      <div className="pt-4 border-t border-slate-100">
        {/* 
          TODO: [Wave Contributor]
          Render contextual actions based on the user role (Tenant/Landlord)
          and current status. 
          For example: if status === "Created", show "Deposit Funds" button for Tenant.
        */}
        <p className="text-sm text-slate-400 italic">
          Contextual actions will appear here based on escrow state.
        </p>
      </div>
    </div>
  );
}
