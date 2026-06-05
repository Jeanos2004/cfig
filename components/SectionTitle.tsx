import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionTitle({ title, subtitle, centered = false, className }: SectionTitleProps) {
  let titleStyle = "text-[var(--color-primary)]"
  if(title == "Notre Équipe d'Experts"){
    titleStyle = "text-[var(--color-white)]"
  }else{
    titleStyle = "text-[var(--color-primary)]"
  }
  return (
    <div className={cn("mb-12", centered && "text-center flex flex-col items-center", className)}>
      <h2 className={`text-3xl md:text-4xl font-heading font-bold  mb-4 ${titleStyle}`}>
        {title}
      </h2>
      <div className="h-1 w-20 bg-[var(--color-accent)] mb-6"></div>
      {subtitle && (
        <p className="text-lg text-gray-400 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
