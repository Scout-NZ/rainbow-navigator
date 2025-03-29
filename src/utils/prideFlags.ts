
// Map of identities to their pride flag backgrounds
export interface PrideIdentity {
  id: string;
  label: string;
  flagGradient: string;
}

export const prideIdentities: PrideIdentity[] = [
  {
    id: "abrosexual",
    label: "Abrosexual",
    flagGradient: "linear-gradient(180deg, #75CA92 20%, #FFFFFF 20% 40%, #F25EB7 40% 60%, #FFFFFF 60% 80%, #75CA92 80%)",
  },
  {
    id: "aceflux",
    label: "Aceflux",
    flagGradient: "linear-gradient(180deg, #000000 16.66%, #F5F5F5 16.66% 33.32%, #800080 33.32% 49.98%, #FFFFFF 49.98% 66.64%, #A9A9A9 66.64% 83.3%, #000000 83.3%)",
  },
  {
    id: "achillean",
    label: "Achillean",
    flagGradient: "linear-gradient(180deg, #078434 20%, #A9D9BA 20% 40%, #FFFFFF 40% 60%, #7ACDDE 60% 80%, #3B1E82 80%)",
  },
  {
    id: "agender",
    label: "Agender",
    flagGradient: "linear-gradient(180deg, #000000 14.28%, #BABABA 14.28% 28.56%, #FFFFFF 28.56% 42.84%, #B8F483 42.84% 57.12%, #FFFFFF 57.12% 71.4%, #BABABA 71.4% 85.68%, #000000 85.68%)",
  },
  {
    id: "ally",
    label: "Ally",
    flagGradient: "linear-gradient(45deg, #FF5757, #FF914D, #FFDE59, #70CE88, #5E9CF5, #9B87F5, #D069C3)",
  },
  {
    id: "aromantic",
    label: "Aromantic",
    flagGradient: "linear-gradient(180deg, #3DA542 20%, #A7D379 20% 40%, #FFFFFF 40% 60%, #A9A9A9 60% 80%, #000000 80%)",
  },
  {
    id: "asexual",
    label: "Asexual",
    flagGradient: "linear-gradient(180deg, #000000 25%, #A3A3A3 25% 50%, #FFFFFF 50% 75%, #800080 75%)",
  },
  {
    id: "bisexual",
    label: "Bisexual",
    flagGradient: "linear-gradient(180deg, #D60270 40%, #9B4F96 40% 60%, #0038A8 60%)",
  },
  {
    id: "demisexual",
    label: "Demisexual",
    flagGradient: "linear-gradient(180deg, #FFFFFF 25%, #6E0070 25% 50%, #D3D3D3 50% 75%, #000000 75%)",
  },
  {
    id: "gay",
    label: "Gay",
    flagGradient: "linear-gradient(180deg, #078D70 16.66%, #26CEAA 16.66% 33.32%, #98E8C1 33.32% 49.98%, #FFFFFF 49.98% 66.64%, #7BADE2 66.64% 83.3%, #5049CC 83.3%)",
  },
  {
    id: "genderfluid",
    label: "Genderfluid",
    flagGradient: "linear-gradient(180deg, #FF75A2 20%, #FFFFFF 20% 40%, #BE18D6 40% 60%, #000000 60% 80%, #333EBD 80%)",
  },
  {
    id: "genderqueer",
    label: "Genderqueer",
    flagGradient: "linear-gradient(180deg, #B57EDC 33.33%, #FFFFFF 33.33% 66.66%, #4A8123 66.66%)",
  },
  {
    id: "intersex",
    label: "Intersex",
    flagGradient: "radial-gradient(circle at center, transparent 10%, #7902AA 12%, #7902AA 18%, transparent 20%), linear-gradient(180deg, #FFDA00 0% 100%)",
  },
  {
    id: "lesbian",
    label: "Lesbian",
    flagGradient: "linear-gradient(180deg, #D62E02 16.66%, #FF9B56 16.66% 33.32%, #FFFFFF 33.32% 49.98%, #D362A4 49.98% 66.64%, #A40062 66.64%)",
  },
  {
    id: "lipstick_lesbian",
    label: "Lipstick Lesbian",
    flagGradient: "linear-gradient(180deg, #A40061 14.28%, #B75592 14.28% 28.56%, #D063A6 28.56% 42.84%, #EDEDEB 42.84% 57.12%, #E4ACCF 57.12% 71.4%, #C54E54 71.4% 85.68%, #8A1E04 85.68%)",
  },
  {
    id: "nonbinary",
    label: "Non-binary",
    flagGradient: "linear-gradient(180deg, #FFF430 25%, #FFFFFF 25% 50%, #9C59D1 50% 75%, #000000 75%)",
  },
  {
    id: "pansexual",
    label: "Pansexual",
    flagGradient: "linear-gradient(180deg, #FF218C 33.33%, #FFD800 33.33% 66.66%, #21B1FF 66.66%)",
  },
  {
    id: "polysexual",
    label: "Polysexual",
    flagGradient: "linear-gradient(180deg, #F61CB9 33.33%, #07D569 33.33% 66.66%, #1C92F6 66.66%)",
  },
  {
    id: "sapphic",
    label: "Sapphic",
    flagGradient: "linear-gradient(180deg, #FE7BB4 20%, #FF9EC4 20% 40%, #FFFFFF 40% 60%, #FFCA8F 60% 80%, #FD9A57 80%)",
  },
  {
    id: "takatapui",
    label: "Takatāpui",
    flagGradient: "url('/lovable-uploads/cc2b11cf-f44a-45f5-866e-9ddefe3c7dbf.png')",
  },
  {
    id: "transgender",
    label: "Transgender",
    flagGradient: "linear-gradient(180deg, #5BCEFA 20%, #F5A9B8 20% 40%, #FFFFFF 40% 60%, #F5A9B8 60% 80%, #5BCEFA 80%)",
  }
];

export const getIdentityById = (id: string | undefined): PrideIdentity | undefined => {
  if (!id) return undefined;
  if (id === "none") return undefined;
  return prideIdentities.find(identity => identity.id === id);
};

export const getIdentityGradient = (id: string | undefined): string => {
  if (id === "none" || !id) {
    // Use the same rainbow gradient as the ally identity for non-selected
    return "linear-gradient(45deg, #FF5757, #FF914D, #FFDE59, #70CE88, #5E9CF5, #9B87F5, #D069C3)";
  }
  const identity = getIdentityById(id);
  return identity?.flagGradient || "linear-gradient(45deg, #FF5757, #FF914D, #FFDE59, #70CE88, #5E9CF5, #9B87F5, #D069C3)";
};
