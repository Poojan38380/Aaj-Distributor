import { Button } from "@/components/ui/button"

export function ContactSection() {
  return (
    <div className="text-center mt-8">
      <div className="flex items-center justify-center gap-2">
        <Button size="sm" asChild>
          <a href="tel:+916398816527" aria-label="Call admin at +91 6398 816 527">
            <span role="img" aria-hidden>
              📞
            </span>
            Call
          </a>
        </Button>
        <Button
          size="sm"
          variant="default"
          className="bg-[#10B981] hover:bg-[#0EA371] text-white"
          asChild
        >
          <a
            href="https://wa.me/916398816527?text=Hello%20AAJ%20Distributor"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp message to admin at +91 6398 816 527"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-3"
              aria-hidden
            >
              <path d="M20.52 3.48A11.94 11.94 0 0 0 12 .5C5.65.5.5 5.65.5 12c0 2.05.54 4.06 1.56 5.84L.52 23.5l5.79-1.52A11.43 11.43 0 0 0 12 23.5c6.35 0 11.5-5.15 11.5-11.5 0-3.07-1.2-5.96-3.48-8.52ZM12 21.5c-1.79 0-3.53-.48-5.05-1.38l-.36-.21-3.4.89.9-3.31-.23-.38A9.46 9.46 0 0 1 2.5 12C2.5 6.76 6.76 2.5 12 2.5s9.5 4.26 9.5 9.5-4.26 9.5-9.5 9.5Zm5.1-6.51c-.28-.14-1.66-.82-1.91-.91-.26-.1-.45-.14-.64.14-.19.28-.73.9-.9 1.08-.17.2-.34.21-.62.07-.28-.14-1.17-.43-2.23-1.36-.82-.73-1.38-1.64-1.54-1.92-.16-.28-.02-.43.12-.57.12-.12.28-.31.42-.47.14-.16.19-.28.28-.47.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.28-.99.97-.99 2.36 0 1.39 1.02 2.73 1.16 2.92.14.19 2 3.06 4.86 4.29.68.29 1.22.46 1.64.59.69.22 1.31.19 1.8.11.55-.08 1.66-.68 1.89-1.33.24-.66.24-1.22.17-1.33-.07-.11-.26-.18-.54-.32Z"/>
            </svg>
            WhatsApp
          </a>
        </Button>
      </div>
    </div>
  )
}
