import EscrowDashboard from "@/components/Escrow/EscrowDashboard";
import WalletRequired from "@/components/Wallet/WalletRequired";

export default function DashboardPage() {
  return (
    <main className="min-h-screen max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
      <WalletRequired>
        <EscrowDashboard />
      </WalletRequired>
    </main>
  );
}
