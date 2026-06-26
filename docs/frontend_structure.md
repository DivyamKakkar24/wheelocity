# Frontend Project Structure & Layer Rules

## Locked Frontend Stack

| Layer | Choice |
|---|---|
| Core | React + Vite |
| Language | TypeScript |
| Routing | React Router |
| Data fetching | TanStack Query |
| Global state | Redux (added later, when needed) |
| Forms | React Hook Form + Zod |
| Styling | SCSS |
| UI Library | MUI |
| HTTP Client | Axios |

This is final.

## Final Folder Structure

```txt
src/
├── assets/images/{icons,logos}/
├── modules/
│   ├── auth/
│   │   └── login/
│   ├── vehicles/
│   │   ├── explore/
│   │   ├── vehicle-details/
│   │   └── sell-vehicle/
│   │       ├── components/
│   │       ├── hooks/              # useCreateVehicle (TanStack mutation)
│   │       └── schemas/            # Zod schema (module-specific)
│   ├── profile/
│   └── dashboard/
├── layout/
│   ├── PublicLayout.tsx            # navbar + footer (landing/explore)
│   └── DashboardLayout.tsx         # sidebar (profile/my listings)
├── api/
│   ├── helpers/
│   │   ├── axiosClient.ts
│   │   └── apiPath.ts
│   └── services/
│       ├── authService.ts
│       ├── vehicleService.ts
│       └── profileService.ts
├── hooks/                          # global hooks (e.g. useAuth, useDebounce)
├── routes/routes.tsx
├── types/
├── utils/
│   ├── common-utils.ts
│   └── validators/zod/             # shared/reusable validation primitives
├── widgets/                        # MUI wrappers (Button, Input, Select)
├── theme/theme.ts                  # MUI createTheme — color palette
├── styles/
│   ├── _variables.scss
│   └── global.scss
├── shared-components/              # VehicleCard, SellerInfoCard, FilterBar
├── store/slices/
├── constants/messages/messages-fe.json
└── tests/
```

---

## Naming Conventions

| File type | Pattern | Example |
|---|---|---|
| Services | `{domain}Service.ts` | `vehicleService.ts`, `authService.ts` |
| Schemas | `{domain}Schema.ts` / `commonSchemas.ts` | `sellVehicleSchema.ts`, `commonSchemas.ts` |
| Hooks | `use{Action}.ts` (React convention) | `useCreateVehicle.ts`, `useAuth.ts` |
| Components | `PascalCase.tsx` (React standard) | `VehicleCard.tsx`, `SellVehicleForm.tsx` |
| Slices | `{domain}Slice.ts` | `authSlice.ts`, `vehicleSlice.ts` |

---

## Layer Rules

- **Modules (pages):** Compose layout, call hooks/services, render widgets/shared-components. No direct Axios calls.
- **API services (`api/services/`):** Pure async functions wrapping Axios calls. One service file per feature.
- **Widgets:** Reusable MUI wrappers — presentational only, no API calls.
- **Shared-components:** Domain-specific reusable components (e.g. dropdowns, cards) — may call API services.

---

## Decision 1: API Services vs. TanStack Query Hooks — Keep Separate

| Layer | Responsibility | Knows about React Query? |
|---|---|---|
| `api/services/vehicleService.ts` | Pure async functions wrapping Axios calls (`createVehicle(data)`, `getVehicleById(id)`) | No |
| `modules/.../hooks/useCreateVehicle.ts` | Wraps the service call with `useMutation`/`useQuery` — adds caching, invalidation, loading states | Yes |

**Why not merge:**
- **Testability** — service functions are plain TS; easy to unit test without a Query Client.
- **Reusability** — a pure service function can be reused outside React (script, SSR); a query/mutation hook is tied to React's render lifecycle.
- **Separation of concerns** — services know "how to call the backend"; hooks know "how this page wants to use that data" (e.g. `onSuccess` → invalidate cache).

**Flow:**
```
Component → useCreateVehicle (hook, in module) → vehicleService.createVehicle() (in api/services) → Axios
```

**Promotion rule:** If a hook is needed across multiple modules (e.g. `useVehicles` used in both `explore` and `dashboard`), promote it to a shared location (global `hooks/` or `api/queries/`) instead of duplicating. Module-local stays the default.

---

## Decision 2: Zod Schemas — Split Local vs. Shared

| What | Where | Why |
|---|---|---|
| Module-specific schema (e.g. `sellVehicleSchema.ts`) | `modules/vehicles/sell-vehicle/schemas/` | Tied to one form; changes with that form; no reuse elsewhere |
| Reusable validation primitives (email, phone, price format) | `utils/validators/zod/` | Used across multiple module schemas — compose, don't duplicate |

**Example:**

```ts
// utils/validators/zod/commonSchemas.ts
export const phoneSchema = z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number");
export const priceSchema = z.number().positive().max(99999999);

// modules/vehicles/sell-vehicle/schemas/sellVehicleSchema.ts
import { phoneSchema, priceSchema } from "@/utils/validators/zod/commonSchemas";

export const sellVehicleSchema = z.object({
  brand: z.string().min(1),
  price: priceSchema,
  sellerPhone: phoneSchema,
  // ...
});
```

**Same rule of thumb as hooks:** start local, promote to shared only when a second module actually needs it.

---

## Decision 3: SCSS Files — Local to Module, Global Only When Shared

Same locality principle as hooks (Decision 1) and schemas (Decision 2).

```txt
modules/vehicles/sell-vehicle/
├── components/
│   ├── VehicleForm.tsx
│   └── VehicleForm.module.scss      # scoped to this component
├── hooks/
├── schemas/
└── SellVehiclePage.scss              # page-level layout for this module
```

| What | Where | Why |
|---|---|---|
| Component/page-specific styles | Co-located inside the module, as `.module.scss` | Scoped to that component; changes with it; no reuse elsewhere |
| Global tokens & resets (`_variables.scss`, `global.scss`) | `styles/` | Needed by every page (color palette, spacing, breakpoints, base typography) |

**Why `.module.scss` (CSS Modules), not plain `.scss` imports:**
- Vite supports CSS Modules out of the box.
- Class names get auto-scoped (e.g. `_VehicleForm_abc123`) — prevents style bleed between modules (e.g. two components both defining `.card`).

**`styles/` stays reserved for:**
- `_variables.scss` — color palette, spacing scale, breakpoints
- `global.scss` — resets, base typography, things every page needs

**Promotion rule (same as before):** styles specific to one module's component stay local. Only promote to `styles/` (as a shared mixin/partial) if a second module genuinely needs the same pattern.

---