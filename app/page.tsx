import { text } from './content/text'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium tracking-tighter">
        {text.home.title}
      </h1>
      <p className="mb-4 whitespace-pre-line">
        {text.home.description}
      </p>
    </section>
  )
}
