"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const messages = [
  "🚚 Frete grátis acima de R$ 200",
  "🔄 Troca e devolução em 30 dias",
  "🔒 Compra 100% segura e criptografada",
];

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const closed = sessionStorage.getItem("announcement-closed");
    if (!closed) setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [visible]);

  function close() {
    setVisible(false);
    sessionStorage.setItem("announcement-closed", "1");
  }

  if (!visible) return null;

  return (
    <div className="relative bg-violet-600 py-2 px-4 text-center text-sm font-medium text-white">
      <span key={index} className="transition-opacity duration-300">
        {messages[index]}
      </span>
      <button
        onClick={close}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-white/20 transition-colors"
        aria-label="Fechar aviso"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
