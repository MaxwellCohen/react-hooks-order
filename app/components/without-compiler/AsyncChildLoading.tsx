"use client";
"use no memo";

export default function AsyncChildLoading() {
  "use no memo";
  console.log("🟨 AsyncChildLoading: render");
  
  return (
    <div className="p-4 border border-blue-300 rounded-lg bg-blue-50 dark:bg-blue-900/20">
      Loading AsyncChild...
    </div>
  );
}

