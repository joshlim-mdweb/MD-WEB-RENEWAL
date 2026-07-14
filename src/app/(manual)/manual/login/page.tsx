"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import "../manual.css";

export default function ManualLogin() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?redirect_to=/manual` },
    });
    setState(error ? "error" : "sent");
  }

  return (
    <div className="mn-root" style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
      <form onSubmit={send} className="mn-ver-block" style={{ width: 360 }}>
        <label>Manual Editor Login</label>
        {state === "sent" ? (
          <p style={{ fontSize: 13.5, margin: "6px 0 0" }}>
            로그인 링크를 보냈어요. <b>{email}</b> 메일함을 확인해 주세요.
          </p>
        ) : (
          <>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@clo3d.com"
              style={{
                width: "100%", padding: "8px 10px", border: "1px solid var(--mn-line)",
                borderRadius: 8, background: "var(--mn-bg)", color: "var(--mn-ink)",
                fontSize: 14, marginBottom: 10, fontFamily: "inherit",
              }}
            />
            <button
              type="submit"
              disabled={state === "sending"}
              style={{
                width: "100%", padding: "9px 0", border: 0, borderRadius: 8,
                background: "var(--mn-accent)", color: "#fff", fontWeight: 700,
                fontSize: 14, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {state === "sending" ? "보내는 중…" : "매직링크 받기"}
            </button>
            {state === "error" && (
              <p style={{ fontSize: 12.5, color: "var(--mn-accent)", marginTop: 8 }}>
                전송에 실패했어요. 잠시 후 다시 시도해 주세요.
              </p>
            )}
          </>
        )}
      </form>
    </div>
  );
}
