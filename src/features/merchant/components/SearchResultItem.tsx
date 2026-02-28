import { Link } from 'react-router-dom'
import { Merchant } from '@/types/api'
import { getZawerColor, getZawerLabel } from '@/utils/zawer'

interface SearchResultItemProps {
  merchant: Merchant
}

export default function SearchResultItem({ merchant }: SearchResultItemProps) {
  const zawerColor = getZawerColor(merchant.zawerIndex)
  const zawerLabel = getZawerLabel(merchant.zawerIndex)

  return (
    <Link
      to={`/merchant/${merchant.id}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{merchant.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{merchant.category}</p>
          <p className="text-sm text-gray-500 mt-1 truncate">{merchant.address}</p>
        </div>
        <div
          className="flex-shrink-0 ml-3 px-3 py-1 rounded-full text-sm font-medium text-white"
          style={{ backgroundColor: zawerColor }}
        >
          {zawerLabel}
        </div>
      </div>
    </Link>
  )
}