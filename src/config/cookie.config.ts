export const cookieConfig = {
    accessToken: {
      httpOnly: true,
      secure: true, 
      sameSite: 'None',
      maxAge: 15 * 60 * 1000, //15 minutos
      path: "/",
    },
    refreshToken: {
      httpOnly: true,
      secure: true, // Apenas em produção
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      path: "/",
    },
  };