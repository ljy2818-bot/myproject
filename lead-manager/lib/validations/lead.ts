import { z } from 'zod'

export const LeadSubmitSchema = z.object({
  full_name: z.string().min(1, '이름을 입력해주세요'),
  phone: z.string().min(1, '전화번호를 입력해주세요'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
})

export const LeadUpdateSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']).optional(),
  notes: z.string().nullable().optional(),
  assigned_to: z.string().uuid().nullable().optional(),
  full_name: z.string().min(1).optional(),
  phone: z.string().optional(),
})

export type LeadSubmitInput = z.infer<typeof LeadSubmitSchema>
export type LeadUpdateInput = z.infer<typeof LeadUpdateSchema>
