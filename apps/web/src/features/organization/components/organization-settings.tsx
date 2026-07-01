"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { memberFormSchema, organizationFormSchema, type MemberFormInput, type OrganizationFormInput, type OrganizationFormOutput } from "@/features/organization/schemas/organization-schema";
import { addOrganizationUser, changeOrganizationUserRole, createOrganization, updateOrganization } from "@/features/organization/services/organization-service";
import type { Organization, OrganizationRole, OrganizationUser } from "@/features/organization/types/organization-types";

type OrganizationSettingsProps = { organization: Organization | null; users: OrganizationUser[] };
const roleLabels: Record<OrganizationRole, string> = { owner: "Proprietário", admin: "Administrador", manager: "Gestor", viewer: "Leitor" };

export function OrganizationSettings({ organization, users }: OrganizationSettingsProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const organizationForm = useForm<OrganizationFormInput, unknown, OrganizationFormOutput>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: { name: organization?.name ?? "", tradeName: organization?.tradeName ?? "", document: organization?.document ?? "", industry: organization?.industry ?? "", website: organization?.website ?? "", notes: organization?.notes ?? "" },
  });
  const memberForm = useForm<MemberFormInput>({ resolver: zodResolver(memberFormSchema), defaultValues: { email: "", role: "viewer" } });

  async function saveOrganization(input: OrganizationFormOutput) {
    setFeedback(null);
    try {
      await (organization ? updateOrganization(input) : createOrganization(input));
      setFeedback({ type: "success", message: organization ? "Organização atualizada." : "Organização criada." });
      router.refresh();
    } catch (error) { setFeedback({ type: "error", message: error instanceof Error ? error.message : "Não foi possível salvar a organização." }); }
  }

  async function addMember(input: MemberFormInput) {
    setFeedback(null);
    try { await addOrganizationUser(input.email, input.role); memberForm.reset(); setFeedback({ type: "success", message: "Membro adicionado." }); router.refresh(); }
    catch (error) { setFeedback({ type: "error", message: error instanceof Error ? error.message : "Não foi possível adicionar o membro." }); }
  }

  async function updateRole(id: string, role: OrganizationRole) {
    setFeedback(null);
    try { await changeOrganizationUserRole(id, role); setFeedback({ type: "success", message: "Papel atualizado." }); router.refresh(); }
    catch (error) { setFeedback({ type: "error", message: error instanceof Error ? error.message : "Não foi possível alterar o papel." }); }
  }

  return (
    <AppShell activeNav="Configurações" eyebrow="Administração" title="Configurações">
      <section className="page-intro"><div><span className="data-label">Organização atual</span><h2>Dados e acesso da conta</h2></div><p>Informações do tenant e usuários autorizados a acompanhar a operação.</p></section>
      {feedback ? <div className={`form-alert ${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>{feedback.message}</div> : null}
      <section className="settings-layout">
        <nav aria-label="Seções de configuração"><a className="active" href="#organization">Organização</a><a href="#members">Membros</a></nav>
        <div className="settings-content">
          <form id="organization" onSubmit={organizationForm.handleSubmit(saveOrganization)}>
            <div className="dashboard-section-heading"><div><h2>{organization ? "Organização" : "Criar organização"}</h2></div></div>
            <div className="form-grid">
              <label className="form-field required"><span>Razão social</span><input {...organizationForm.register("name")} />{organizationForm.formState.errors.name ? <small>{organizationForm.formState.errors.name.message}</small> : null}</label>
              <label className="form-field"><span>Nome de exibição</span><input {...organizationForm.register("tradeName")} /></label>
              <label className="form-field"><span>Documento</span><input {...organizationForm.register("document")} /></label>
              <label className="form-field"><span>Segmento</span><input {...organizationForm.register("industry")} /></label>
              <label className="form-field form-field-wide"><span>Website</span><input placeholder="https://empresa.com.br" {...organizationForm.register("website")} />{organizationForm.formState.errors.website ? <small>{organizationForm.formState.errors.website.message}</small> : null}</label>
              <label className="form-field form-field-wide"><span>Observações</span><textarea rows={3} {...organizationForm.register("notes")} /></label>
            </div>
            <div className="form-actions"><button className="primary-action" disabled={organizationForm.formState.isSubmitting} type="submit">{organizationForm.formState.isSubmitting ? "Salvando..." : organization ? "Salvar alterações" : "Criar organização"}</button></div>
          </form>

          {organization ? <section className="members-settings" id="members">
            <div className="dashboard-section-heading"><div><h2>Membros</h2></div><span>{users.length} usuários</span></div>
            <form className="member-add-form" onSubmit={memberForm.handleSubmit(addMember)}>
              <label className="form-field"><span>E-mail</span><input placeholder="gestor@empresa.com.br" {...memberForm.register("email")} />{memberForm.formState.errors.email ? <small>{memberForm.formState.errors.email.message}</small> : null}</label>
              <label className="form-field"><span>Papel</span><select {...memberForm.register("role")}><option value="admin">Administrador</option><option value="manager">Gestor</option><option value="viewer">Leitor</option></select></label>
              <button className="secondary-action" disabled={memberForm.formState.isSubmitting} type="submit">Adicionar membro</button>
            </form>
            <div className="member-list">{users.map((member) => <div className="member-row" key={member.id}><div className="avatar" aria-hidden="true">{member.user.name.slice(0, 2).toUpperCase()}</div><div><strong>{member.user.name}</strong><span>{member.user.email}</span></div><select aria-label={`Papel de ${member.user.name}`} defaultValue={member.role} disabled={member.role === "owner"} onChange={(event) => void updateRole(member.id, event.target.value as OrganizationRole)}>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>)}</div>
          </section> : null}
        </div>
      </section>
    </AppShell>
  );
}
