"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { createEmployee, deleteEmployee, Employee, getEmployees } from "@/lib/firestore/employees";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type UploadResult = {
  url: string;
  pathname: string;
  contentType?: string;
  size?: number;
};

const defaultDepartments = [
  "Founder and executive director",
  "Development Manager",
  "Office Manager and accountant",
  "Sales",
  "Coordinators",
  "logistic support",
];

export default function AdminEmployeesPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [employees, setEmployees] = useState<Employee[]>([]);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState(defaultDepartments[0]);
  const [departmentCustom, setDepartmentCustom] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const effectiveDepartment = useMemo(() => {
    const custom = departmentCustom.trim();
    return custom.length ? custom : department;
  }, [department, departmentCustom]);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getEmployees();
      setEmployees(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const uploadToBlob = async (): Promise<UploadResult> => {
    if (!user) throw new Error("Not signed in");
    if (!file) throw new Error("Please choose an image");

    const token = await user.getIdToken();
    const form = new FormData();
    form.append("file", file);
    form.append("name", name);
    form.append("department", effectiveDepartment);

    const res = await fetch("/api/employees/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      throw new Error(payload?.error || "Upload failed");
    }

    return (await res.json()) as UploadResult;
  };

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedRole = role.trim();
    const trimmedDept = effectiveDepartment.trim();

    if (!trimmedName || !trimmedRole || !trimmedDept) {
      setError("Name, role, and department are required.");
      return;
    }

    try {
      setSaving(true);

      const upload = await uploadToBlob();
      await createEmployee({
        name: trimmedName,
        role: trimmedRole,
        department: trimmedDept,
        imageUrl: upload.url,
        blobPath: upload.pathname,
      });

      setName("");
      setRole("");
      setDepartment(defaultDepartments[0]);
      setDepartmentCustom("");
      setFile(null);

      await refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to create employee");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (emp: Employee) => {
    if (!emp.id) return;
    if (!confirm(`Delete ${emp.name}?`)) return;

    try {
      if (user?.getIdToken && emp.blobPath) {
        const token = await user.getIdToken();
        await fetch("/api/employees/delete", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ urlOrPathname: emp.blobPath }),
        });
      }
      await deleteEmployee(emp.id);
      await refresh();
    } catch (err) {
      alert("Failed to delete employee.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end gap-6 flex-wrap">
        <div>
          <h1 className="text-3xl font-display text-primary">Employees</h1>
          <p className="text-foreground/70 font-body text-sm mt-1">Add and manage your public-facing team members.</p>
        </div>
        <Badge variant="outline">{employees.length} total</Badge>
      </div>

      <form onSubmit={onCreate} className="bg-surface-container rounded-sm border border-outline-variant/10 p-8 space-y-6">
        {error && (
          <div className="text-xs text-error p-3 bg-error-container/20 rounded-sm border border-error/20">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-body text-foreground/50 uppercase tracking-widest block">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-body text-foreground/50 uppercase tracking-widest block">Role</label>
            <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role / title" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-body text-foreground/50 uppercase tracking-widest block">Department</label>
            <select
              className="w-full bg-surface-container-low h-12 px-4 border-b border-transparent focus:border-primary font-body text-foreground outline-none"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              aria-label="Department"
            >
              {defaultDepartments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <div className="text-[10px] text-foreground/40 font-body">Optionally override with a custom value:</div>
            <Input value={departmentCustom} onChange={(e) => setDepartmentCustom(e.target.value)} placeholder="Custom department (optional)" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-body text-foreground/50 uppercase tracking-widest block">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              aria-label="Employee image"
              className="block w-full text-sm text-foreground/70 file:mr-4 file:rounded-sm file:border-0 file:bg-surface-container-high file:px-4 file:py-2 file:text-foreground/80 hover:file:bg-surface-container"
            />
            <div className="text-[10px] text-foreground/40 font-body">PNG/JPG/WebP, max 5MB.</div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-outline-variant/10">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Uploading..." : "Add Employee"}
          </Button>
        </div>
      </form>

      <div className="bg-surface-container rounded-sm border border-outline-variant/10 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-6 h-6 border-t-2 border-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body text-sm">
              <thead className="bg-surface-container-high text-foreground/50 border-b border-outline-variant/10 text-xs uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-normal">Employee</th>
                  <th className="px-6 py-4 font-normal">Department</th>
                  <th className="px-6 py-4 font-normal">Role</th>
                  <th className="px-6 py-4 font-normal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 min-w-[260px]">
                        <div className="size-12 rounded-full overflow-hidden bg-surface-container-low ring-1 ring-outline-variant/20 shrink-0">
                          <Image
                            src={emp.imageUrl}
                            alt={emp.name}
                            width={96}
                            height={96}
                            className="h-full w-full object-cover object-center grayscale"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-primary-container">{emp.name}</div>
                          <div className="text-xs text-foreground/50 mt-1 truncate max-w-[320px]">{emp.imageUrl}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="text-[10px]">
                        {emp.department}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-foreground/70">{emp.role}</td>
                    <td className="px-6 py-4">
                      <Button type="button" variant="danger" size="sm" onClick={() => onDelete(emp)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}

                {employees.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-foreground/40 italic">
                      No employees yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

