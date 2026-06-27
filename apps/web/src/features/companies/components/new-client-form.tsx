"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createCompanyFormSchema } from "@/features/companies/schemas/company-schema";
import { createCompany } from "@/features/companies/services/company-service";
import type {
  Company,
  CreateCompanyFormValues,
  CreateCompanyInput,
} from "@/features/companies/types/company-types";

const defaultValues: CreateCompanyFormValues = {
  document: "",
  industry: "",
  name: "",
  notes: "",
  tradeName: "",
  website: "",
};

export function NewClientForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [createdCompany, setCreatedCompany] = useState<Company | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<CreateCompanyFormValues, unknown, CreateCompanyInput>({
    defaultValues,
    resolver: zodResolver(createCompanyFormSchema),
  });

  async function onSubmit(input: CreateCompanyInput) {
    setSubmitError(null);
    setCreatedCompany(null);

    try {
      const company = await createCompany(input);
      setCreatedCompany(company);
      reset(defaultValues);
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Não foi possível criar o cliente.",
      );
    }
  }

  return (
    <div className="new-client-flow">
      <button
        aria-expanded={isOpen}
        className="primary-action"
        onClick={() => {
          setIsOpen((current) => !current);
          setSubmitError(null);
        }}
        type="button"
      >
        Novo cliente
      </button>

      {isOpen && (
        <form className="client-create-panel" onSubmit={handleSubmit(onSubmit)}>
          <div className="panel-header">
            <div>
              <div className="section-title">Cadastro</div>
              <h3>Novo cliente</h3>
            </div>
            <button
              className="ghost-action"
              disabled={isSubmitting}
              onClick={() => setIsOpen(false)}
              type="button"
            >
              Cancelar
            </button>
          </div>

          <div className="form-grid">
            <label className="form-field required">
              <span>Razão social</span>
              <input
                aria-invalid={Boolean(errors.name)}
                placeholder="Ex: Kairos Performance Lab"
                {...register("name")}
              />
              {errors.name?.message && <small>{errors.name.message}</small>}
            </label>

            <label className="form-field">
              <span>Nome fantasia</span>
              <input placeholder="Ex: Kairos Lab" {...register("tradeName")} />
            </label>

            <label className="form-field">
              <span>Documento</span>
              <input placeholder="CNPJ ou CPF" {...register("document")} />
            </label>

            <label className="form-field">
              <span>Segmento</span>
              <input placeholder="Ex: Consultoria" {...register("industry")} />
            </label>

            <label className="form-field form-field-wide">
              <span>Website</span>
              <input
                aria-invalid={Boolean(errors.website)}
                placeholder="https://empresa.com.br"
                {...register("website")}
              />
              {errors.website?.message && <small>Informe uma URL válida.</small>}
            </label>

            <label className="form-field form-field-wide">
              <span>Observações</span>
              <textarea
                placeholder="Contexto inicial, origem do cliente ou ponto de atenção"
                rows={3}
                {...register("notes")}
              />
            </label>
          </div>

          {submitError && (
            <div className="form-alert error" role="alert">
              {submitError}
            </div>
          )}

          <div className="form-actions">
            <button
              className="secondary-action"
              disabled={isSubmitting}
              onClick={() => setIsOpen(false)}
              type="button"
            >
              Cancelar
            </button>
            <button className="primary-action" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Criando..." : "Criar cliente"}
            </button>
          </div>
        </form>
      )}

      {createdCompany && (
        <div className="form-alert success" role="status">
          Cliente {createdCompany.name} criado na API.
        </div>
      )}
    </div>
  );
}
