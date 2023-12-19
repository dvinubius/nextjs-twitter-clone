import type { InferGetStaticPropsType, NextPage } from "next";
import * as fs from 'fs';
import { remark } from 'remark';
import html from 'remark-html';
import path from 'path';


const About: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({content}) => {
  return (  
    <div className="app-markdown p-4" dangerouslySetInnerHTML={{ __html: content }} />
  );
}

export default About;


export async function getStaticProps() {
  const dirPath = path.join(process.cwd(), 'markdown');
  const fullPath = path.join(dirPath, `about.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const processedContent = (await remark().use(html).process(fileContents)).toString();
  return {
    props: {
      content: processedContent
    },
  };
}