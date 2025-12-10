import { useState } from "react";

interface LoginResponse {
  tenant_id: string;
  full_name: string;
  profile_picture: string | null;
  department: string;
  permissions: string;
  user_email: string;
  username: string;
  connection_id: string | null;
  phone_number: string | null;
  connection_username: string | null;
}

interface CreateAccountData {
  nome: string;
  email: string;
  senha: string;
  whatsapp: string;
}

interface CreateAccountResponse {
  account_status: string;
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const checkLogin = async (email: string, password: string): Promise<LoginResponse | null> => {
    setIsLoading(true);
    
    try {
      const response = await fetch("https://webhook.wiseuptech.com.br/webhook/haimoveisDATABASE", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_name: "check_login",
          email: email,
          password: password,
          tenant_id: '1911202511'
        }),
      });

      if (!response.ok) throw new Error("Erro ao verificar login");

      const data: LoginResponse[] = await response.json();
      
      if (data && data.length > 0) {
        return data[0];
      }
      
      return null;
    } catch (error) {
      console.error("Erro ao verificar login:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createAccount = async (accountData: CreateAccountData): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      const response = await fetch("https://webhook.wiseuptech.com.br/webhook/haimoveisDATABASE", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_name: "create_account",
          name: accountData.nome,
          email: accountData.email,
          password: accountData.senha,
          whatsapp: accountData.whatsapp,
          tenant_id: '1911202511'
        }),
      });

      if (!response.ok) throw new Error("Erro ao criar conta");

      const data: CreateAccountResponse[] = await response.json();
      
      if (data && data.length > 0) {
        const status = data[0].account_status;
        
        if (status === "Conta criada com sucesso!") {
          return { success: true, message: "Cadastro realizado com sucesso! Acesse sua conta com o seu email e senha!" };
        } else if (status === "Este email já está sendo usado!") {
          return { success: false, message: "Cadastro não realizado! Já existe conta com esse email!" };
        }
      }

      return { success: false, message: "Erro ao criar conta. Tente novamente." };
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      return { success: false, message: "Erro ao criar conta. Tente novamente." };
    } finally {
      setIsLoading(false);
    }
  };

  return { checkLogin, createAccount, isLoading };
}
