import React from "react";

export function ToastItem({ title, description, variant }) {
  const base = "rounded-lg shadow-lg p-4 max-w-xs break-words";
  const mapVariant = {
    default: "bg-white border border-gray-200 text-gray-900",
    success: "bg-green-50 border border-green-200 text-green-900",
    destructive: "bg-red-50 border border-red-200 text-red-900",
  };
  const classes = [base, mapVariant[variant] || mapVariant.default].join(" ");

  return (
    <div className={classes} role="status" aria-live="polite">
      {title && <div className="font-semibold mb-1 text-sm">{title}</div>}
      {description && <div className="text-sm leading-snug">{description}</div>}
    </div>
  );
}
