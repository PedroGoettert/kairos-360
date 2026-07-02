import { and, asc, eq, inArray, ne } from "drizzle-orm";

import { auth } from "../auth/index.js";
import { env } from "../env/index.js";
import { db, sql } from "./index.js";
import {
  actionPlans,
  baselineDiagnosticAnswers,
  baselineDiagnostics,
  baselineDiagnosticScores,
  companies,
  companyDiagnosticAreas,
  companyDiagnosticQuestions,
  diagnosticAnswers,
  diagnosticScores,
  diagnosticTemplateAreas,
  diagnosticTemplateQuestions,
  diagnosticTemplates,
  diagnostics,
  manualMetrics,
  organizationBaselineAreas,
  organizationBaselineQuestions,
  organizationUsers,
  organizations,
  user as users,
} from "./schema/index.js";

const seedPassword = "Kairos@123456";

const defaultTemplate = {
  name: "Diagnostico Padrao",
  slug: "diagnostico-padrao",
  description:
    "Template base do Diagnostico 360 com areas padrao e perguntas iniciais.",
  isDefault: true,
} as const;

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
      question:
        "A operacao consegue absorver aumento de demanda sem perda de qualidade?",
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

const defaultAreas = [
  { name: "Marketing", slug: "marketing" },
  { name: "Comercial", slug: "comercial" },
  { name: "Operacao", slug: "operacao" },
  { name: "Financeiro", slug: "financeiro" },
  { name: "Gestao", slug: "gestao" },
  { name: "Atendimento", slug: "atendimento" },
  { name: "Recursos Humanos", slug: "recursos-humanos" },
] as const;

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
    actionPlans: [
      {
        title: "Revisar posicionamento e proposta de valor",
        responsible: "Pedro Admin",
        dueDateOffsetDays: 15,
        status: "not_started",
      },
      {
        title: "Padronizar rotina de acompanhamento das campanhas",
        responsible: "Marina Consultora",
        dueDateOffsetDays: 30,
        status: "in_progress",
      },
    ],
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
    actionPlans: [
      {
        title: "Implantar rotina semanal de fluxo de caixa",
        responsible: "Pedro Admin",
        dueDateOffsetDays: 10,
        status: "in_progress",
      },
    ],
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
    actionPlans: [
      {
        title: "Estruturar cadencia comercial com follow-up",
        responsible: "Marina Consultora",
        dueDateOffsetDays: 20,
        status: "not_started",
      },
    ],
  },
] as const;

const seedOrganization = {
  name: "Kairos Operacao",
  slug: "kairos-operacao",
  tradeName: "Kairos",
  document: "45.678.901/0001-34",
  industry: "Consultoria e Operacoes",
  website: "https://kairos.example",
  notes:
    "Organizacao padrao local para validar o novo dominio baseado em tenant.",
} as const;

const seedManualMetrics = [
  {
    category: "finance",
    metricKey: "monthly_revenue",
    metricLabel: "Faturamento mensal",
    value: 128450,
    unit: "BRL",
    referenceDateOffsetDays: -30,
    notes: "Fechamento do mes anterior consolidado.",
  },
  {
    category: "finance",
    metricKey: "monthly_revenue",
    metricLabel: "Faturamento mensal",
    value: 136980,
    unit: "BRL",
    referenceDateOffsetDays: 0,
    notes: "Fechamento parcial do mes corrente.",
  },
  {
    category: "sales",
    metricKey: "sales_conversion_rate",
    metricLabel: "Taxa de conversao comercial",
    value: 18.6,
    unit: "%",
    referenceDateOffsetDays: 0,
    notes: "Conversao de oportunidades em vendas.",
  },
  {
    category: "marketing",
    metricKey: "qualified_leads",
    metricLabel: "Leads qualificados",
    value: 146,
    unit: "leads",
    referenceDateOffsetDays: 0,
    notes: "Leads com perfil ideal no periodo atual.",
  },
  {
    category: "operations",
    metricKey: "sla_compliance",
    metricLabel: "Cumprimento de SLA",
    value: 92.4,
    unit: "%",
    referenceDateOffsetDays: 0,
    notes: "Pedidos entregues dentro do prazo acordado.",
  },
  {
    category: "customer_service",
    metricKey: "first_response_time",
    metricLabel: "Tempo medio de primeira resposta",
    value: 47,
    unit: "min",
    referenceDateOffsetDays: 0,
    notes: "Media das interacoes de atendimento do periodo.",
  },
  {
    category: "hr",
    metricKey: "team_attendance",
    metricLabel: "Presenca do time",
    value: 96.1,
    unit: "%",
    referenceDateOffsetDays: 0,
    notes: "Presenca consolidada da equipe operacional.",
  },
  {
    category: "management",
    metricKey: "strategic_actions_completed",
    metricLabel: "Acoes estrategicas concluidas",
    value: 7,
    unit: "acoes",
    referenceDateOffsetDays: 0,
    notes: "Entregas executivas finalizadas no ciclo atual.",
  },
] as const;

type SeedUser = (typeof seedUsers)[number];
type SeedCompany = (typeof seedCompanies)[number];

function addDays(baseDate: Date, offsetDays: number) {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + offsetDays);
  return date;
}

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

async function ensureCompany(seedCompany: SeedCompany, ownerUserId: string) {
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

async function ensureOrganization(
  ownerUserId: string,
  memberUserIds: ReadonlyArray<{
    userId: string;
    role: "owner" | "admin" | "manager" | "viewer";
  }>,
) {
  const [existingOrganization] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.slug, seedOrganization.slug))
    .limit(1);

  const organization =
    existingOrganization ??
    (
      await db
        .insert(organizations)
        .values({
          createdByUserId: ownerUserId,
          name: seedOrganization.name,
          slug: seedOrganization.slug,
          tradeName: seedOrganization.tradeName,
          document: seedOrganization.document,
          industry: seedOrganization.industry,
          website: seedOrganization.website,
          notes: seedOrganization.notes,
        })
        .returning()
    )[0];

  if (!organization) {
    throw new Error("Failed to seed organization");
  }

  const memberIds = memberUserIds.map((memberUser) => memberUser.userId);

  // Only local development seed is allowed to disable active memberships
  // outside the default organization in order to keep the environment reusable.
  if (env.NODE_ENV === "development" && memberIds.length > 0) {
    await db
      .update(organizationUsers)
      .set({ status: "disabled" })
      .where(
        and(
          inArray(organizationUsers.userId, memberIds),
          ne(organizationUsers.organizationId, organization.id),
          eq(organizationUsers.status, "active"),
        ),
      );
  }

  await db
    .delete(organizationUsers)
    .where(eq(organizationUsers.organizationId, organization.id));

  await db.insert(organizationUsers).values(
    memberUserIds.map((memberUser) => ({
      organizationId: organization.id,
      userId: memberUser.userId,
      role: memberUser.role,
      status: "active" as const,
    })),
  );

  return organization;
}

async function ensureDefaultTemplate() {
  const [existingTemplate] = await db
    .select()
    .from(diagnosticTemplates)
    .where(eq(diagnosticTemplates.slug, defaultTemplate.slug))
    .limit(1);

  const template =
    existingTemplate ??
    (
      await db
        .insert(diagnosticTemplates)
        .values(defaultTemplate)
        .returning()
    )[0];

  if (!template) {
    throw new Error("Failed to seed default diagnostic template");
  }

  for (const [index, areaSeed] of defaultAreas.entries()) {
    const [existingArea] = await db
      .select()
      .from(diagnosticTemplateAreas)
      .where(
        and(
          eq(diagnosticTemplateAreas.templateId, template.id),
          eq(diagnosticTemplateAreas.slug, areaSeed.slug),
        ),
      )
      .limit(1);

    const area =
      existingArea ??
      (
        await db
          .insert(diagnosticTemplateAreas)
          .values({
            templateId: template.id,
            name: areaSeed.name,
            slug: areaSeed.slug,
            description: null,
            displayOrder: index + 1,
          })
          .returning()
      )[0];

    if (!area) {
      throw new Error(`Failed to seed template area ${areaSeed.slug}`);
    }

    const questions = seedQuestionsByArea[areaSeed.slug] ?? [];

    for (const [questionIndex, questionSeed] of questions.entries()) {
      const [existingQuestion] = await db
        .select()
        .from(diagnosticTemplateQuestions)
        .where(
          and(
            eq(diagnosticTemplateQuestions.templateAreaId, area.id),
            eq(diagnosticTemplateQuestions.question, questionSeed.question),
          ),
        )
        .limit(1);

      if (existingQuestion) {
        await db
          .update(diagnosticTemplateQuestions)
          .set({
            description: questionSeed.description,
            displayOrder: questionIndex + 1,
          })
          .where(eq(diagnosticTemplateQuestions.id, existingQuestion.id));
        continue;
      }

      await db.insert(diagnosticTemplateQuestions).values({
        templateAreaId: area.id,
        question: questionSeed.question,
        description: questionSeed.description,
        displayOrder: questionIndex + 1,
      });
    }
  }

  return template;
}

async function ensureCompanyDiagnosticSetup(
  companyId: string,
  templateId: string,
) {
  const [existingArea] = await db
    .select({
      id: companyDiagnosticAreas.id,
    })
    .from(companyDiagnosticAreas)
    .where(eq(companyDiagnosticAreas.companyId, companyId))
    .limit(1);

  if (existingArea) {
    return;
  }

  const templateAreas = await db
    .select()
    .from(diagnosticTemplateAreas)
    .where(eq(diagnosticTemplateAreas.templateId, templateId))
    .orderBy(asc(diagnosticTemplateAreas.displayOrder));

  const templateQuestions = await db
    .select()
    .from(diagnosticTemplateQuestions)
    .where(inArray(diagnosticTemplateQuestions.templateAreaId, templateAreas.map((area) => area.id)))
    .orderBy(
      asc(diagnosticTemplateQuestions.templateAreaId),
      asc(diagnosticTemplateQuestions.displayOrder),
    );

  const areaIdMap = new Map<string, string>();

  for (const templateArea of templateAreas) {
    const [companyArea] = await db
      .insert(companyDiagnosticAreas)
      .values({
        companyId,
        templateAreaId: templateArea.id,
        name: templateArea.name,
        slug: templateArea.slug,
        description: templateArea.description,
        displayOrder: templateArea.displayOrder,
      })
      .returning();

    if (!companyArea) {
      throw new Error(
        `Failed to create company diagnostic area ${templateArea.slug}`,
      );
    }

    areaIdMap.set(templateArea.id, companyArea.id);
  }

  for (const templateQuestion of templateQuestions) {
    const companyAreaId = areaIdMap.get(templateQuestion.templateAreaId);

    if (!companyAreaId) {
      continue;
    }

    await db.insert(companyDiagnosticQuestions).values({
      companyAreaId,
      templateQuestionId: templateQuestion.id,
      question: templateQuestion.question,
      description: templateQuestion.description,
      displayOrder: templateQuestion.displayOrder,
    });
  }
}

async function ensureOrganizationBaselineSetup(
  organizationId: string,
  templateId: string,
) {
  const [existingArea] = await db
    .select({ id: organizationBaselineAreas.id })
    .from(organizationBaselineAreas)
    .where(eq(organizationBaselineAreas.organizationId, organizationId))
    .limit(1);

  if (existingArea) {
    return;
  }

  const templateAreas = await db
    .select()
    .from(diagnosticTemplateAreas)
    .where(eq(diagnosticTemplateAreas.templateId, templateId))
    .orderBy(asc(diagnosticTemplateAreas.displayOrder));

  const templateAreaIds = templateAreas.map((area) => area.id);
  const templateQuestions =
    templateAreaIds.length === 0
      ? []
      : await db
          .select()
          .from(diagnosticTemplateQuestions)
          .where(
            inArray(diagnosticTemplateQuestions.templateAreaId, templateAreaIds),
          )
          .orderBy(
            asc(diagnosticTemplateQuestions.templateAreaId),
            asc(diagnosticTemplateQuestions.displayOrder),
          );

  const areaIdMap = new Map<string, string>();

  for (const templateArea of templateAreas) {
    const [organizationArea] = await db
      .insert(organizationBaselineAreas)
      .values({
        organizationId,
        templateAreaId: templateArea.id,
        name: templateArea.name,
        slug: templateArea.slug,
        description: templateArea.description,
        displayOrder: templateArea.displayOrder,
      })
      .returning();

    if (!organizationArea) {
      throw new Error(
        `Failed to create organization baseline area ${templateArea.slug}`,
      );
    }

    areaIdMap.set(templateArea.id, organizationArea.id);
  }

  for (const templateQuestion of templateQuestions) {
    const organizationAreaId = areaIdMap.get(templateQuestion.templateAreaId);

    if (!organizationAreaId) {
      continue;
    }

    await db.insert(organizationBaselineQuestions).values({
      organizationAreaId,
      templateQuestionId: templateQuestion.id,
      question: templateQuestion.question,
      description: templateQuestion.description,
      displayOrder: templateQuestion.displayOrder,
    });
  }
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
  companyId: string,
  diagnosticId: string,
  areaScores: Record<string, readonly number[]>,
) {
  const areas = await db
    .select()
    .from(companyDiagnosticAreas)
    .where(eq(companyDiagnosticAreas.companyId, companyId))
    .orderBy(asc(companyDiagnosticAreas.displayOrder));

  const areaIds = areas.map((area) => area.id);
  const questions =
    areaIds.length === 0
      ? []
      : await db
          .select()
          .from(companyDiagnosticQuestions)
          .where(
            and(
              eq(companyDiagnosticQuestions.isActive, true),
              inArray(companyDiagnosticQuestions.companyAreaId, areaIds),
            ),
          )
          .orderBy(
            asc(companyDiagnosticQuestions.companyAreaId),
            asc(companyDiagnosticQuestions.displayOrder),
          );

  const questionsByAreaSlug = new Map<
    string,
    Array<typeof companyDiagnosticQuestions.$inferSelect>
  >();

  for (const area of areas) {
    questionsByAreaSlug.set(
      area.slug,
      questions.filter((question) => question.companyAreaId === area.id),
    );
  }

  await db
    .delete(diagnosticAnswers)
    .where(eq(diagnosticAnswers.diagnosticId, diagnosticId));
  await db
    .delete(diagnosticScores)
    .where(eq(diagnosticScores.diagnosticId, diagnosticId));

  for (const [areaSlug, scores] of Object.entries(areaScores)) {
    const area = areas.find((companyArea) => companyArea.slug === areaSlug);
    const areaQuestions = questionsByAreaSlug.get(areaSlug) ?? [];

    if (!area) {
      continue;
    }

    const answerValues = areaQuestions.map((question, index) => ({
      diagnosticId,
      questionId: question.id,
      score: scores[index] ?? scores.at(-1) ?? 0,
      comment: `Resposta ficticia para ${areaSlug.replace("-", " ")}.`,
    }));

    if (answerValues.length > 0) {
      await db.insert(diagnosticAnswers).values(answerValues);
    }

    if (scores.length === 0) {
      continue;
    }

    const averageScore =
      scores.reduce((total, score) => total + score, 0) / scores.length;

    await db.insert(diagnosticScores).values({
      diagnosticId,
      areaId: area.id,
      score: Number(averageScore.toFixed(2)),
    });
  }
}

async function ensureBaselineDiagnostic(
  organizationId: string,
  createdByUserId: string,
  title: string,
  notes: string,
  status: "draft" | "completed",
) {
  const [existingDiagnostic] = await db
    .select()
    .from(baselineDiagnostics)
    .where(
      and(
        eq(baselineDiagnostics.organizationId, organizationId),
        eq(baselineDiagnostics.title, title),
      ),
    )
    .limit(1);

  if (existingDiagnostic) {
    const [diagnostic] = await db
      .update(baselineDiagnostics)
      .set({
        createdByUserId,
        notes,
        status,
        completedAt: status === "completed" ? new Date() : null,
      })
      .where(eq(baselineDiagnostics.id, existingDiagnostic.id))
      .returning();

    if (!diagnostic) {
      throw new Error(`Failed to update baseline diagnostic ${title}`);
    }

    return diagnostic;
  }

  const [diagnostic] = await db
    .insert(baselineDiagnostics)
    .values({
      organizationId,
      createdByUserId,
      title,
      notes,
      status,
      completedAt: status === "completed" ? new Date() : null,
    })
    .returning();

  if (!diagnostic) {
    throw new Error(`Failed to seed baseline diagnostic ${title}`);
  }

  return diagnostic;
}

async function replaceBaselineDiagnosticAnswers(
  organizationId: string,
  diagnosticId: string,
  areaScores: Record<string, readonly number[]>,
) {
  const areas = await db
    .select()
    .from(organizationBaselineAreas)
    .where(eq(organizationBaselineAreas.organizationId, organizationId))
    .orderBy(asc(organizationBaselineAreas.displayOrder));

  const areaIds = areas.map((area) => area.id);
  const questions =
    areaIds.length === 0
      ? []
      : await db
          .select()
          .from(organizationBaselineQuestions)
          .where(
            and(
              eq(organizationBaselineQuestions.isActive, true),
              inArray(organizationBaselineQuestions.organizationAreaId, areaIds),
            ),
          )
          .orderBy(
            asc(organizationBaselineQuestions.organizationAreaId),
            asc(organizationBaselineQuestions.displayOrder),
          );

  const questionsByAreaSlug = new Map<
    string,
    Array<typeof organizationBaselineQuestions.$inferSelect>
  >();

  for (const area of areas) {
    questionsByAreaSlug.set(
      area.slug,
      questions.filter((question) => question.organizationAreaId === area.id),
    );
  }

  await db
    .delete(baselineDiagnosticAnswers)
    .where(eq(baselineDiagnosticAnswers.diagnosticId, diagnosticId));
  await db
    .delete(baselineDiagnosticScores)
    .where(eq(baselineDiagnosticScores.diagnosticId, diagnosticId));

  for (const [areaSlug, scores] of Object.entries(areaScores)) {
    const area = areas.find((organizationArea) => organizationArea.slug === areaSlug);
    const areaQuestions = questionsByAreaSlug.get(areaSlug) ?? [];

    if (!area) {
      continue;
    }

    const answerValues = areaQuestions.map((question, index) => ({
      diagnosticId,
      questionId: question.id,
      score: scores[index] ?? scores.at(-1) ?? 0,
      comment: `Resposta baseline para ${areaSlug.replace("-", " ")}.`,
    }));

    if (answerValues.length > 0) {
      await db.insert(baselineDiagnosticAnswers).values(answerValues);
    }

    if (scores.length === 0) {
      continue;
    }

    const averageScore =
      scores.reduce((total, score) => total + score, 0) / scores.length;

    await db.insert(baselineDiagnosticScores).values({
      diagnosticId,
      areaId: area.id,
      score: Number(averageScore.toFixed(2)),
    });
  }
}

async function ensureActionPlansForDiagnostic(
  companyId: string,
  diagnosticId: string,
  createdByUserId: string,
  planSeeds: ReadonlyArray<{
    title: string;
    responsible: string;
    dueDateOffsetDays: number;
    status: "not_started" | "in_progress" | "completed";
  }>,
) {
  await db.delete(actionPlans).where(eq(actionPlans.diagnosticId, diagnosticId));

  if (planSeeds.length === 0) {
    return;
  }

  await db.insert(actionPlans).values(
    planSeeds.map((planSeed) => ({
      companyId,
      createdByUserId,
      diagnosticId,
      title: planSeed.title,
      responsible: planSeed.responsible,
      dueDate: new Date(Date.now() + planSeed.dueDateOffsetDays * 86400000),
      status: planSeed.status,
    })),
  );
}

async function replaceOrganizationManualMetrics(
  organizationId: string,
  createdByUserId: string,
) {
  const referenceBaseDate = new Date();

  await db
    .delete(manualMetrics)
    .where(eq(manualMetrics.organizationId, organizationId));

  await db.insert(manualMetrics).values(
    seedManualMetrics.map((metric) => ({
      organizationId,
      createdByUserId,
      category: metric.category,
      metricKey: metric.metricKey,
      metricLabel: metric.metricLabel,
      value: metric.value,
      unit: metric.unit,
      referenceDate: addDays(referenceBaseDate, metric.referenceDateOffsetDays),
      notes: metric.notes,
    })),
  );
}

async function main() {
  if (env.NODE_ENV === "production") {
    throw new Error("Database seed is disabled in production.");
  }

  const seededUsers = new Map<string, Awaited<ReturnType<typeof ensureUser>>>();

  for (const seedUser of seedUsers) {
    const user = await ensureUser(seedUser);
    seededUsers.set(seedUser.email, user);
  }

  const adminUser = seededUsers.get("admin@kairos.local");
  const consultantUser = seededUsers.get("consultora@kairos.local");
  const viewerUser = seededUsers.get("viewer@kairos.local");

  if (!adminUser || !consultantUser || !viewerUser) {
    throw new Error("Expected seeded users were not created");
  }

  await ensureOrganization(adminUser.id, [
    { userId: adminUser.id, role: "owner" },
    { userId: consultantUser.id, role: "manager" },
    { userId: viewerUser.id, role: "viewer" },
  ]);

  const template = await ensureDefaultTemplate();
  const [organization] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.slug, seedOrganization.slug))
    .limit(1);

  if (!organization) {
    throw new Error("Seeded organization not found");
  }

  await ensureOrganizationBaselineSetup(organization.id, template.id);
  const seededCompanies = [];

  for (const seedCompany of seedCompanies) {
    const owner = seededUsers.get(seedCompany.ownerEmail);

    if (!owner) {
      throw new Error(`Owner not found for ${seedCompany.name}`);
    }

    const company = await ensureCompany(seedCompany, owner.id);
    await ensureCompanyDiagnosticSetup(company.id, template.id);
    seededCompanies.push({ company, owner });
  }

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
      seededCompany.company.id,
      diagnostic.id,
      profile.areaScores,
    );
    await ensureActionPlansForDiagnostic(
      seededCompany.company.id,
      diagnostic.id,
      seededCompany.owner.id,
      profile.actionPlans,
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

  const baselineDiagnostic = await ensureBaselineDiagnostic(
    organization.id,
    adminUser.id,
    "Baseline manual - Kairos Operacao",
    "Diagnostico baseline inicial da operacao Kairos.",
    "completed",
  );

  await replaceBaselineDiagnosticAnswers(
    organization.id,
    baselineDiagnostic.id,
    scoreProfiles[0].areaScores,
  );
  await replaceOrganizationManualMetrics(organization.id, adminUser.id);

  console.log("Seed completed successfully.");
  console.log(`Users: ${seedUsers.length}`);
  console.log(`Companies: ${seedCompanies.length}`);
  console.log(`Organization: ${seedOrganization.tradeName}`);
  console.log(`Manual metrics: ${seedManualMetrics.length}`);
  console.log(`Default template: ${defaultTemplate.name}`);
  console.log(`Login email: ${adminUser.email}`);
  console.log(`Default password: ${seedPassword}`);
}

try {
  await main();
} finally {
  await sql.end();
}
