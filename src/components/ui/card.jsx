import React from "react";
import { cn } from "../../lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white shadow-sm p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("mb-2 font-semibold text-lg", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("text-gray-700 text-sm", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn("text-xl font-bold tracking-tight text-gray-900", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("mt-4 border-t pt-3", className)} {...props}>
      {children}
    </div>
  );
}
