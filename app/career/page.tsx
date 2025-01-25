import { text } from '../content/text'

export default function CareerPage() {
  const { amazon, workday } = text.career.roles;
  const { ucsb } = text.career.education;

  return (
    <section className="lowercase">
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">{text.career.title}</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <h2 className="text-xl font-medium mb-4">{text.career.experience}</h2>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium">{amazon.title}</h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            {amazon.period}
          </p>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            {amazon.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {amazon.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium">{workday.title}</h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            {workday.period}
          </p>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            {workday.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {workday.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-medium mb-4">{text.career.educationTitle}</h2>
        <div className="mb-8">
          <h3 className="text-lg font-medium">{ucsb.title}</h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            {ucsb.degree}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {ucsb.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 