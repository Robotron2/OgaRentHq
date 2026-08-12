import DemoHelper from "@/components/Demo/DemoHelper";

export default function DemoPage() {
  return (
    <main className="min-h-[80vh] max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 bg-surface">
      <div className="text-center mb-8">
        <h1 className="font-display-md text-primary">Demo Setup</h1>
      </div>
      <DemoHelper />
    </main>
  );
}
