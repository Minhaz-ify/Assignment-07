"use client";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";

export default function SocialButtons({ callbackURL = "/" }) {
  async function social(provider, label) {
    try {
      await signIn.social({ provider, callbackURL });
    } catch {
      toast.error(`${label} দিয়ে চালিয়ে যাওয়া যায়নি`);
    }
  }
  return (
    <div className="space-y-2">
      <button type="button" onClick={() => social("google", "Google")} className="btn btn-outline w-full gap-2">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path fill="#4285f4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 01-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.700 3.3-8z" />
          <path fill="#34a853" d="M12 23c3 0 5.500-1 7.300-2.700l-3.500-2.700c-1 .7-2.300 1.100-3.800 1.100-2.900 0-5.400-2-6.300-4.600H2.100v2.800A11 11 0 0012 23z" />
          <path fill="#fbbc05" d="M5.700 14.100a6.600 6.600 0 010-4.200V7.100H2.100a11 11 0 000 9.800l3.600-2.800z" />
          <path fill="#ea4335" d="M12 5.400c1.600 0 3.100.6 4.200 1.700l3.100-3.100A11 11 0 002.100 7.100l3.600 2.800C6.600 7.400 9.100 5.400 12 5.400z" />
        </svg>
        Google দিয়ে চালিয়ে যান
      </button>
      <button type="button" onClick={() => social("github", "GitHub")} className="btn btn-outline w-full gap-2">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M12 .5a11.500 11.500 0 00-3.600 22.400c.6.100.8-.3.8-.6v-2c-3.200.7-3.900-1.500-3.900-1.500-.5-1.300-1.300-1.700-1.300-1.700-1-.7.100-.7.100-.7 1.200.1 1.800 1.200 1.800 1.200 1 1.800 2.800 1.300 3.400 1 .1-.8.400-1.300.7-1.600-2.600-.3-5.300-1.300-5.300-5.700 0-1.300.5-2.300 1.200-3.100-.1-.3-.5-1.500.1-3.100 0 0 1-.3 3.200 1.200a11 11 0 015.800 0c2.200-1.500 3.200-1.200 3.200-1.200.6 1.600.2 2.800.1 3.100.8.800 1.200 1.800 1.200 3.100 0 4.400-2.700 5.400-5.300 5.700.4.400.8 1.100.8 2.200v3.200c0 .3.200.7.800.6A11.500 11.500 0 0012 .5z" />
        </svg>
        GitHub দিয়ে চালিয়ে যান
      </button>
    </div>
  );
}
