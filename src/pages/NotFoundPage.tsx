import { Link } from 'react-router-dom'
import { UiText } from '../components/Bi'

export function NotFoundPage() {
  return (
    <div className="page empty-state">
      <h1>
        <UiText en="Page not found" bn="পাতাটি পাওয়া যায়নি" />
      </h1>
      <p>
        <UiText
          en="This chapter may have moved. Use the sidebar or search to find it."
          bn="অধ্যায়টি হয়তো সরানো হয়েছে। সাইডবার বা সার্চ ব্যবহার করো।"
        />
      </p>
      <Link to="/" className="btn btn-primary">
        <UiText en="Go home" bn="হোমে ফেরো" />
      </Link>
    </div>
  )
}
