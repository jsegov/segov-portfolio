export const text = {
  home: {
    title: 'hello world',
    description: `my name is jonathan segovia, but some people call me segov. i am currently a swe at jeff bezos' online bookstore where i help automate content publishing at our netflix clone. previously i was a swe at workday where i played ping pong, attended happy hours, and failed at convincing leadership that workday was slow due to it's flawed design. i attended ucsb (aka paradise on earth), where i majored in computer science and minored in binge drinking. 
    
    obviously this is a satirical summary of my relevant experience, if you wanna read more serious descriptions of my work experience you can check the career page or my linkedin. to learn more about my side projects check out the projects page or my github. or if you'd like to learn more about me in chatbot form, you can click the chat icon in the bottom right corner and ask it anything about me (but please don't spam so i don't burn through all my openai credits).
    `
  },
  career: {
    title: 'career',
    experience: 'experience',
    educationTitle: 'education',
    education: {
      ucsb: {
        title: 'university of california, santa barbara',
        degree: 'b.s. computer science • 2018',
        skills: ['algorithms', 'data structures', 'chegg (rip)', 'beer die']
      }
    },
    roles: {
      amazon: {
        title: 'software engineer 2',
        period: 'amazon • july 2021 - present',
        description: `at amazon, i've focused on building and improving prime video's content delivery infrastructure. 
        i designed and implemented microservices that automate quality assurance and release processes for tv shows and movies, 
        significantly enhancing release efficiency while maintaining prime video's high quality standards. 
        i led a project that expanded automated quality checks from 40 to over 300, making content release decisions more thorough and precise. 
        through infrastructure optimization, i helped reduce aws costs by $7.2m annually. recently, i created a proof of concept for a gen ai 
        powered release decision chatbot using claude 3 on aws bedrock, exploring how ai can streamline content operations.`,
        skills: ['java', 'typescript', 'aws', 'distributed systems']
      },
      workday: {
        title: 'senior associate software engineer',
        period: 'workday • july 2019 - june 2021',
        description: `during my time at workday, i contributed to several key initiatives in the business intelligence and development platforms. 
        i developed a report suggestion framework that helped internal developers optimize report generation through custom rules. 
        i also worked on enhancing a low-code application platform using typescript, react, and scala, enabling users to build workday 
        applications more efficiently. i improved the development pipeline for ml applications by optimizing deployment processes with 
        teamcity and created automation scripts for vmware-based ml environments, which improved development agility and environment consistency.`,
        skills: ['kotlin', 'typescript', 'scala', 'react', 'teamcity']
      }
    }
  },
  projects: {
    title: 'projects',
    items: [
      {
        title: 'online portfolio',
        description: 'this, a portfolio website deployed on vercel and built using Next.js, React, TailwindCSS and telling cursor what to do. info about my experience as a swe, and an AI-powered chatbot that i added so i can say i have gen ai experience.',
        githubUrl: 'https://github.com/jsegov/segov-portfolio',
        technologies: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'vercel', 'gen ai', 'cursor']
      }
    ]
  },
  nav: {
    home: 'home',
    career: 'career',
    projects: 'projects'
  }
}; 