
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "public": {
          Tables: {
            "businesses": {
                  Row: {
                    "category": string,"created_at": string,"currency": string,"description": string | null,"id": string,"image_url": string | null,"is_open": boolean,"lat": number | null,"lng": number | null,"name": string,"owner_id": string,"whatsapp": string
                  }
                  ComputedFields: never
                  Insert: {
                    "category": string,"created_at"?: string,"currency"?: string,"description"?: string | null,"id"?: string,"image_url"?: string | null,"is_open"?: boolean,"lat"?: number | null,"lng"?: number | null,"name": string,"owner_id": string,"whatsapp": string
                  }
                  Update: {
                    "category"?: string,"created_at"?: string,"currency"?: string,"description"?: string | null,"id"?: string,"image_url"?: string | null,"is_open"?: boolean,"lat"?: number | null,"lng"?: number | null,"name"?: string,"owner_id"?: string,"whatsapp"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "businesses_owner_id_fkey"
      columns: ["owner_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"products": {
                  Row: {
                    "business_id": string,"cost": number | null,"created_at": string,"id": string,"image_url": string | null,"is_active": boolean,"name": string,"price": number,"sort_order": number
                  }
                  ComputedFields: never
                  Insert: {
                    "business_id": string,"cost"?: number | null,"created_at"?: string,"id"?: string,"image_url"?: string | null,"is_active"?: boolean,"name": string,"price": number,"sort_order"?: number
                  }
                  Update: {
                    "business_id"?: string,"cost"?: number | null,"created_at"?: string,"id"?: string,"image_url"?: string | null,"is_active"?: boolean,"name"?: string,"price"?: number,"sort_order"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "products_business_id_fkey"
      columns: ["business_id"]
isOneToOne: false
      referencedRelation: "businesses"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "created_at": string,"display_name": string,"id": string,"locale": string,"phone": string | null,"role": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"display_name": string,"id": string,"locale"?: string,"phone"?: string | null,"role": string
                  }
                  Update: {
                    "created_at"?: string,"display_name"?: string,"id"?: string,"locale"?: string,"phone"?: string | null,"role"?: string
                  }
                  Relationships: [
                    
                  ]
                },"sales_entries": {
                  Row: {
                    "business_id": string,"cost_at_sale": number | null,"created_at": string,"id": string,"price_at_sale": number,"product_id": string,"sold_on": string,"units": number
                  }
                  ComputedFields: never
                  Insert: {
                    "business_id": string,"cost_at_sale"?: number | null,"created_at"?: string,"id"?: string,"price_at_sale": number,"product_id": string,"sold_on": string,"units": number
                  }
                  Update: {
                    "business_id"?: string,"cost_at_sale"?: number | null,"created_at"?: string,"id"?: string,"price_at_sale"?: number,"product_id"?: string,"sold_on"?: string,"units"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "sales_entries_business_id_fkey"
      columns: ["business_id"]
isOneToOne: false
      referencedRelation: "businesses"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "sales_entries_product_fkey"
      columns: ["product_id","business_id"]
isOneToOne: false
      referencedRelation: "products"
      referencedColumns: ["id","business_id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "nearby_businesses":
{ Args: { "from_lat": number,"from_lng": number,"max_km"?: number,"max_results"?: number }; Returns: {
              "category": string,"currency": string,"description": string,"distance_km": number,"id": string,"image_url": string,"is_open": boolean,"lat": number,"lng": number,"name": string,"whatsapp": string
            }[]
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            
          }
        }
} as const
