import { Merchant } from '@/types/api'

interface MerchantInfoProps {
  merchant: Merchant
}

const rows = [
  {
    key: 'address' as const,
    icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z',
  },
  {
    key: 'businessHours' as const,
    icon: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20a8 8 0 110-16 8 8 0 010 16zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
  },
  {
    key: 'phone' as const,
    icon: 'M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.25 1.02l-2.2 2.21z',
  },
]

export default function MerchantInfo({ merchant }: MerchantInfoProps) {
  return (
    <div>
      <h1 className="text-gm-xl font-normal text-ink-primary">{merchant.name}</h1>
      <p className="mt-1 text-gm-base text-ink-secondary">{merchant.category}</p>

      <div className="mt-4 space-y-3">
        {rows.map(({ key, icon }) => {
          const value = merchant[key]
          if (!value) return null

          return (
            <div key={key} className="flex items-start gap-4">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-ink-secondary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d={icon} />
              </svg>
              {key === 'phone' ? (
                <a href={`tel:${value}`} className="text-gm-base text-gm-blue hover:underline">
                  {value}
                </a>
              ) : (
                <span className="text-gm-base text-ink-primary">{value}</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
