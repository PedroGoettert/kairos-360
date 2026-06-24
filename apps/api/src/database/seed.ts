import { and, eq } from "drizzle-orm";

import { auth } from "../auth/index.js";
import { db, sql } from "./index.js";
import {
  companies,
  diagnosticAnswers,
  diagnosticAreas,
  diagnosticQuestions,
  diagnosticScores,
  diagnostics,
  user as users,
} from "./schema/index.js";

const seedPassword = "Kairos@123456";

const seedUsers = [
  {
    name: "Pedro Admin",
    email: "admin@kairos.local",
    role: "admin",
  },
  {
    name: "Marina Consultora",
    email: "consultora@kairos.local",
    role: "consultant",
  },
  {
    name: "Lucas Viewer",
    email: "viewer@kairos.local",
    role: "viewer",
  },
] as const;

const seedCompanies = [
  {
    ownerEmail: "admin@kairos.local",
    name: "Aurora Foods LTDA",
    tradeName: "Aurora Foods",
    document: "12.345.678/0001-90",
    industry: "Alimentos",
    website: "https://aurorafoods.example",
    notes: "Cliente ficticio com operacao regional e vendas B2B.",
  },
  {
    ownerEmail: "admin@kairos.local",
    name: "Nexo Fit Academia LTDA",
    tradeName: "Nexo Fit",
    document: "23.456.789/0001-01",
    industry: "Fitness",
    website: "https://nexofit.example",
    notes: "Rede ficticia de academias em expansao.",
  },
  {
    ownerEmail: "consultora@kairos.local",
    name: "Verde Campo Solar SA",
    tradeName: "Verde Campo Solar",
    document: "34.567.890/0001-12",
    industry: "Energia",
    website: "https://verdecamposolar.example",
    notes: "Empresa ficticia de energia solar para diagnosticos consultivos.",
  },
] as const;

const seedQuestionsByArea: Record<
  string,
  Array<{ question: string; description: string }>
> = {
  marketing: [
    {
      question: "A empresa possui posicionamento claro para seu publico-alvo?",
      description: "Avalia clareza de proposta de valor, nicho e mensagem.",
    },
    {
      question: "Os canais digitais geram demanda qualificada de forma recorrente?",
      description: "Avalia consistencia de aquisicao e qualidade dos leads.",
    },
    {
      question: "As campanhas possuem metas, verba e indicadores acompanhados?",
      description: "Avalia disciplina de gestao de campanhas.",
    },
  ],
  comercial: [
    {
      question: "O processo comercial possui etapas definidas e registradas?",
      description: "Avalia pipeline, rotina e previsibilidade de vendas.",
    },
    {
      question: "A equipe faz follow-up com cadencia padronizada?",
      description: "Avalia velocidade e consistencia no relacionamento comercial.",
    },
    {
      question: "As taxas de conversao sao acompanhadas por etapa?",
      description: "Avalia visibilidade dos gargalos comerciais.",
    },
  ],
  operacao: [
    {
      question: "Os processos operacionais estao documentados?",
      description: "Avalia padronizacao e facilidade de treinamento.",
    },
    {
      question: "A empresa mede prazos, retrabalho e produtividade?",
      description: "Avalia controle operacional e melhoria continua.",
    },
    {
      question: "A operacao consegue absorver aumento de demanda sem perda de qualidade?",
      description: "Avalia capacidade de escala.",
    },
  ],
  financeiro: [
    {
      question: "O fluxo de caixa e atualizado e projetado regularmente?",
      description: "Avalia controle de entradas, saidas e previsibilidade.",
    },
    {
      question: "A empresa conhece margem por produto, servico ou canal?",
      description: "Avalia qualidade das decisoes economicas.",
    },
    {
      question: "Existem metas financeiras acompanhadas pela lideranca?",
      description: "Avalia gestao de resultado.",
    },
  ],
  gestao: [
    {
      question: "A lideranca acompanha indicadores-chave com rotina definida?",
      description: "Avalia cadencia de gestao e tomada de decisao.",
    },
    {
      question: "As prioridades estrategicas estao claras para a equipe?",
      description: "Avalia alinhamento e foco organizacional.",
    },
    {
      question: "Existem responsaveis e prazos claros para iniciativas importantes?",
      description: "Avalia execucao e accountability.",
    },
  ],
  atendimento: [
    {
      question: "A empresa mede satisfacao e recorrencia dos clientes?",
      description: "Avalia pos-venda e fidelizacao.",
    },
    {
      question: "Reclamacoes sao registradas e tratadas com prazo definido?",
      description: "Avalia controle de qualidade percebida.",
    },
    {
      question: "O time de atendimento possui scripts e padroes de resposta?",
      description: "Avalia consistencia da experiencia do cliente.",
    },
  ],
  "recursos-humanos": [
    {
      question: "As funcoes e responsabilidades estao bem definidas?",
      description: "Avalia clareza organizacional.",
    },
    {
      question: "A empresa possui rotina de feedback e desenvolvimento?",
      description: "Avalia maturidade de gestao de pessoas.",
    },
    {
      question: "Contratacoes seguem perfil, etapas e criterios definidos?",
      description: "Avalia previsibilidade na formacao do time.",
    },
  ],
};

const scoreProfiles = [
  {
    title: "Diagnostico inicial - Aurora Foods",
    notes: "Diagnostico ficticio com gargalo principal em Marketing.",
    areaScores: {
      marketing: [4, 5, 4],
      comercial: [6, 6, 7],
      operacao: [7, 8, 7],
      financeiro: [5, 6, 5],
      gestao: [7, 7, 8],
      atendimento: [8, 7, 8],
      "recursos-humanos": [6, 6, 7],
    },
  },
  {
    title: "Diagnostico inicial - Nexo Fit",
    notes: "Diagnostico ficticio com gargalo principal em Financeiro.",
    areaScores: {
      marketing: [7, 8, 7],
      comercial: [8, 7, 8],
      operacao: [6, 7, 6],
      financeiro: [3, 4, 4],
      gestao: [5, 6, 5],
      atendimento: [7, 7, 6],
      "recursos-humanos": [6, 5, 6],
    },
  },
  {
    title: "Diagnostico inicial - Verde Campo Solar",
    notes: "Diagnostico ficticio com gargalo principal em Comercial.",
    areaScores: {
      marketing: [6, 7, 6],
      comercial: [4, 4, 5],
      operacao: [8, 7, 8],
      financeiro: [7, 6, 7],
      gestao: [6, 6, 6],
      atendimento: [8, 8, 7],
      "recursos-humanos": [7, 7, 8],
    },
  },
] as const;

type SeedUser = (typeof seedUsers)[number];
type SeedCompany = (typeof seedCompanies)[number];

async function ensureUser(seedUser: SeedUser) {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, seedUser.email))
    .limit(1);

  if (!existingUser) {
    await auth.api.signUpEmail({
      body: {
        name: seedUser.name,
        email: seedUser.email,
        password: seedPassword,
      },
    });
  }

  const [user] = await db
    .update(users)
    .set({
      name: seedUser.name,
      role: seedUser.role,
      emailVerified: true,
    })
    .where(eq(users.email, seedUser.email))
    .returning();

  if (!user) {
    throw new Error(`Failed to seed user ${seedUser.email}`);
  }

  return user;
}

async function ensureCompany(
  seedCompany: SeedCompany,
  ownerUserId: string,
) {
  const [existingCompany] = await db
    .select()
    .from(companies)
    .where(
      and(
        eq(companies.ownerUserId, ownerUserId),
        eq(companies.name, seedCompany.name),
      ),
    )
    .limit(1);

  if (existingCompany) {
    const [company] = await db
      .update(companies)
      .set({
        tradeName: seedCompany.tradeName,
        document: seedCompany.document,
        industry: seedCompany.industry,
        website: seedCompany.website,
        notes: seedCompany.notes,
      })
      .where(eq(companies.id, existingCompany.id))
      .returning();

    if (!company) {
      throw new Error(`Failed to update company ${seedCompany.name}`);
    }

    return company;
  }

  const [company] = await db
    .insert(companies)
    .values({
      ownerUserId,
      name: seedCompany.name,
      tradeName: seedCompany.tradeName,
      document: seedCompany.document,
      industry: seedCompany.industry,
      website: seedCompany.website,
      notes: seedCompany.notes,
    })
    .returning();

  if (!company) {
    throw new Error(`Failed to seed company ${seedCompany.name}`);
  }

  return company;
}

async function ensureQuestions() {
  const areas = await db.select().from(diagnosticAreas);
  const questionsByAreaSlug = new Map<
    string,
    Array<typeof diagnosticQuestions.$inferSelect>
  >();

  for (const area of areas) {
    const seedQuestions = seedQuestionsByArea[area.slug] ?? [];
    const areaQuestions = [];

    for (const [index, seedQuestion] of seedQuestions.entries()) {
      const [existingQuestion] = await db
        .select()
        .from(diagnosticQuestions)
        .where(
          and(
            eq(diagnosticQuestions.areaId, area.id),
            eq(diagnosticQuestions.question, seedQuestion.question),
          ),
        )
        .limit(1);

      if (existingQuestion) {
        const [question] = await db
          .update(diagnosticQuestions)
          .set({
            description: seedQuestion.description,
            displayOrder: index + 1,
            isActive: true,
          })
          .where(eq(diagnosticQuestions.id, existingQuestion.id))
          .returning();

        if (!question) {
          throw new Error(`Failed to update question ${seedQuestion.question}`);
        }

        areaQuestions.push(question);
        continue;
      }

      const [question] = await db
        .insert(diagnosticQuestions)
        .values({
          areaId: area.id,
          question: seedQuestion.question,
          description: seedQuestion.description,
          displayOrder: index + 1,
        })
        .returning();

      if (!question) {
        throw new Error(`Failed to seed question ${seedQuestion.question}`);
      }

      areaQuestions.push(question);
    }

    questionsByAreaSlug.set(area.slug, areaQuestions);
  }

  return questionsByAreaSlug;
}

async function ensureDiagnostic(
  companyId: string,
  createdByUserId: string,
  title: string,
  notes: string,
  status: "draft" | "completed",
) {
  const [existingDiagnostic] = await db
    .select()
    .from(diagnostics)
    .where(and(eq(diagnostics.companyId, companyId), eq(diagnostics.title, title)))
    .limit(1);

  if (existingDiagnostic) {
    const [diagnostic] = await db
      .update(diagnostics)
      .set({
        createdByUserId,
        notes,
        status,
        completedAt: status === "completed" ? new Date() : null,
      })
      .where(eq(diagnostics.id, existingDiagnostic.id))
      .returning();

    if (!diagnostic) {
      throw new Error(`Failed to update diagnostic ${title}`);
    }

    return diagnostic;
  }

  const [diagnostic] = await db
    .insert(diagnostics)
    .values({
      companyId,
      createdByUserId,
      title,
      notes,
      status,
      completedAt: status === "completed" ? new Date() : null,
    })
    .returning();

  if (!diagnostic) {
    throw new Error(`Failed to seed diagnostic ${title}`);
  }

  return diagnostic;
}

async function replaceDiagnosticAnswers(
  diagnosticId: string,
  questionsByAreaSlug: Map<string, Array<typeof diagnosticQuestions.$inferSelect>>,
  areaScores: Record<string, readonly number[]>,
) {
  await db
    .delete(diagnosticAnswers)
    .where(eq(diagnosticAnswers.diagnosticId, diagnosticId));
  await db
    .delete(diagnosticScores)
    .where(eq(diagnosticScores.diagnosticId, diagnosticId));

  for (const [areaSlug, scores] of Object.entries(areaScores)) {
    const questions = questionsByAreaSlug.get(areaSlug) ?? [];
    const answerValues = questions.map((question, index) => ({
      diagnosticId,
      questionId: question.id,
      score: scores[index] ?? scores.at(-1) ?? 0,
      comment: `Resposta ficticia para ${areaSlug.replace("-", " ")}.`,
    }));

    if (answerValues.length > 0) {
      await db.insert(diagnosticAnswers).values(answerValues);
    }

    const areaId = questions[0]?.areaId;

    if (!areaId || scores.length === 0) {
      continue;
    }

    const averageScore =
      scores.reduce((total, score) => total + score, 0) / scores.length;

    await db.insert(diagnosticScores).values({
      diagnosticId,
      areaId,
      score: Number(averageScore.toFixed(2)),
    });
  }
}

async function main() {
  const seededUsers = new Map<string, Awaited<ReturnType<typeof ensureUser>>>();

  for (const seedUser of seedUsers) {
    const user = await ensureUser(seedUser);
    seededUsers.set(seedUser.email, user);
  }

  const seededCompanies = [];

  for (const seedCompany of seedCompanies) {
    const owner = seededUsers.get(seedCompany.ownerEmail);

    if (!owner) {
      throw new Error(`Owner not found for ${seedCompany.name}`);
    }

    const company = await ensureCompany(seedCompany, owner.id);
    seededCompanies.push({ company, owner });
  }

  const questionsByAreaSlug = await ensureQuestions();

  for (const [index, profile] of scoreProfiles.entries()) {
    const seededCompany = seededCompanies[index];

    if (!seededCompany) {
      continue;
    }

    const diagnostic = await ensureDiagnostic(
      seededCompany.company.id,
      seededCompany.owner.id,
      profile.title,
      profile.notes,
      "completed",
    );

    await replaceDiagnosticAnswers(
      diagnostic.id,
      questionsByAreaSlug,
      profile.areaScores,
    );
  }

  const firstCompany = seededCompanies[0];

  if (firstCompany) {
    await ensureDiagnostic(
      firstCompany.company.id,
      firstCompany.owner.id,
      "Diagnostico em andamento - Aurora Foods",
      "Diagnostico ficticio em rascunho para testar novas respostas.",
      "draft",
    );
  }

  console.log("Seed completed successfully.");
  console.log(`Users: ${seedUsers.length}`);
  console.log(`Companies: ${seedCompanies.length}`);
  console.log(`Default password: ${seedPassword}`);
}

try {
  await main();
} finally {
  await sql.end();
}
