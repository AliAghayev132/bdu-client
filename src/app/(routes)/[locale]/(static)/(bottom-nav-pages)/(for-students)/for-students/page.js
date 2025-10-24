import BlogPageContent from "@/components/common/BlogPageContent";
import { buildLocalizedMetadata } from "@/seo/metadata";


// Simpler, locale-based content
const content = {
  en: {
    title: "FOR STUDENTS",
    breadcrumbs: "For students",
    content: {
        body:  `<p class="text-container tracking-wider leading-[1.8]">&nbsp; &nbsp; Studying at a university is a very exciting process that takes a significant part of a student’s time and attention. Moreover, education shapes the path for later life, professional activity, and influences the quality of life in the long run. There are wonderful teachers at Baku State University (BSU) — there can be no doubt about their professionalism. It is also worth noting that the level of knowledge is quite high, ensuring demand for our graduates in the job market. <br/>

The educational process at the university differs significantly from the organization of the educational process in high school. One of the main tasks of the university is to teach students to learn and develop independently throughout their lives. During their studies, only the foundations of knowledge in the chosen field are laid. The main goal during the university education period is to master methods of independent intellectual work, consciously develop creative abilities, and acquire skills in creative activity. For this, strict adherence to discipline in learning and behavior is necessary. <br/>

You are a student of a new era — there are no longer borders in the educational sphere, the education system of Azerbaijan has integrated into the European education system and has transitioned to a modular system. The European Credit Transfer System (ECTS) is a general European system designed to account for the study load of students in mastering an educational program or course. In ECTS, the academic year generally consists of 60 credits. Credits are assigned based on grades from A to E, with F considered unsatisfactory. Credits are distributed among all theoretical and practical components of the program (subjects, modules, internships, course and diploma works, etc.). <br/>

Each student will have an individual educational plan based on personal choice, and your tutor will assist in its preparation. <br/>

You should know the basic concepts important for student life. In lectures, practical (seminar) classes, and laboratory work, students acquire essential information on the subjects studied and strengthen their knowledge and skills. In the university, the main form of classes is lectures. During lectures, teachers convey the core material of the subject to students. Attentively listening to lectures and taking notes requires intensive mental effort from the student. When working on a lecture outline, it is necessary to use not only the textbook but also additional literature recommended by the teacher. <br/>
</br>
To reinforce and deepen the theoretical knowledge obtained in lectures and during independent work, seminar classes are held. Seminars check the level of understanding and assimilation of the educational material by students in the subjects and thoroughly analyze the most complex theoretical issues. Laboratory classes are one of the forms of practical classes that combine theory and practice. Laboratory work is based on the main principles of the theoretical course and is carried out in laboratories equipped with the appropriate equipment. <br/>
</br>
Independent work includes studying lecture material, preparing for classes, writing essays and reports, preparing for colloquiums and exams, writing course works (projects), and participating in scientific research. The educational process covers the following methods of knowledge assessment: control work, written test, colloquium, exam (written or oral). A colloquium is a form of current assessment conducted to check and evaluate students' knowledge, a mini-exam that takes place during the semester. The scores collected in the colloquium influence the final grade. An exam is the main form of assessment and knowledge verification for students at the end of the semester. Each student must prepare thoroughly for the session and successfully pass all exams. <br/>
</br>
During their studies at the university, students must undergo various types of internships. Internship is an integral part of training modern specialists. Its task is to strengthen the theoretical knowledge acquired during studies at the university and develop the necessary skills for practical work in their specialty. In higher courses, students undergo internships at institutions, departments, or organizations relevant to their chosen specialty. <br/>
</br>
During your studies at the university, you will have the opportunity to engage in scientific work. By conducting scientific research, you will deepen your understanding of theoretical material, develop creative search skills, gain experience in theoretical and practical research, and generally show higher results during the session. <br/>
</br>
How can you make student life within the walls of the university interesting and beneficial? <br/>
</br>
At the university, various events are always held for students (sports competitions, student scientific conferences, meetings with prominent representatives of the scientific community, creative competitions, flash mobs, quests, and clubs operate). Thus, if you actively participate in at least a small number of such events, you won’t have time to get bored. <br/></p>`
    }
  },
};

export default async function TelebeUcunPage({ params }) {
  const { locale } = await params;
  return <BlogPageContent content={content.en} locale={locale} />;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildLocalizedMetadata({
    locale,
    slugs: { az: "/telebeler-ucun", en: "/en/for-students" },
    title: { az: "Tələbələr üçün", en: "For Students" },
    description: {
      az: "BDU-da tələbə həyatı, tədris prosesi və imkanlar haqqında məlumat.",
      en: "Information about student life, education process and opportunities at BSU.",
    },
    keywords: {
      az: "BDU, tələbə, təhsil, universitet, tələbələr üçün",
      en: "BSU, student, education, university, for students",
    },
  });
}

