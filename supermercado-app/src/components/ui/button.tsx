import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "primary"; // Variantes del botón
  size?: "icon" | "default"; // Tamaños disponibles
  className?: string; // Clases adicionales que el usuario puede proporcionar
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary", // Valor predeterminado para el estilo
  size = "default", // Valor predeterminado para el tamaño
  className = "", // Valor predeterminado para clases adicionales
  ...props // Otras props como `onClick`, `disabled`, etc.
}) => {
  // Clases base para estilos comunes
  const baseClasses = "px-4 py-2 rounded transition-all duration-200 focus:outline-none focus:ring";
  
  // Estilos condicionales basados en la variante
  const variantClasses =
    variant === "ghost"
      ? "bg-transparent hover:bg-gray-200 text-black"
      : "bg-black text-white hover:bg-gray-800";

  // Estilos condicionales basados en el tamaño
  const sizeClasses =
    size === "icon"
      ? "p-2 text-lg" // Tamaño reducido para botones tipo ícono
      : "px-4 py-2 text-base"; // Tamaño estándar

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props} // Se pasan todas las demás propiedades
    >
      {props.children} {/* Renderiza el contenido del botón */}
    </button>
  );
};
