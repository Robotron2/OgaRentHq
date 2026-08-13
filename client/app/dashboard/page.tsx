import EscrowDashboard from "@/components/Escrow/EscrowDashboard";
import WalletRequired from "@/components/Wallet/WalletRequired";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <main className="min-h-screen max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
      <WalletRequired>
        <Suspense fallback={<div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
          <EscrowDashboard />
        </Suspense>
      </WalletRequired>
    </main>
  );
}
