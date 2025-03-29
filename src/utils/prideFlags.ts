
// Map of identities to their pride flag backgrounds
export interface PrideIdentity {
  id: string;
  label: string;
  flagGradient: string;
}

export const prideIdentities: PrideIdentity[] = [
  {
    id: "gay",
    label: "Gay",
    flagGradient: "linear-gradient(180deg, #FF0018 16.66%, #FFA52C 16.66% 33.32%, #FFFF41 33.32% 49.98%, #008018 49.98% 66.64%, #0000F9 66.64% 83.3%, #86007D 83.3%)",
  },
  {
    id: "lesbian",
    label: "Lesbian",
    flagGradient: "linear-gradient(180deg, #D62E02 16.66%, #FF9B56 16.66% 33.32%, #FFFFFF 33.32% 49.98%, #D362A4 49.98% 66.64%, #A40062 66.64%)",
  },
  {
    id: "bisexual",
    label: "Bisexual",
    flagGradient: "linear-gradient(180deg, #D60270 40%, #9B4F96 40% 60%, #0038A8 60%)",
  },
  {
    id: "transgender",
    label: "Transgender",
    flagGradient: "linear-gradient(180deg, #5BCEFA 20%, #F5A9B8 20% 40%, #FFFFFF 40% 60%, #F5A9B8 60% 80%, #5BCEFA 80%)",
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
    id: "asexual",
    label: "Asexual",
    flagGradient: "linear-gradient(180deg, #000000 25%, #A3A3A3 25% 50%, #FFFFFF 50% 75%, #800080 75%)",
  },
  {
    id: "genderqueer",
    label: "Genderqueer",
    flagGradient: "linear-gradient(180deg, #B57EDC 33.33%, #FFFFFF 33.33% 66.66%, #4A8123 66.66%)",
  },
  {
    id: "ally",
    label: "Ally",
    flagGradient: "linear-gradient(45deg, #FF5757, #FF914D, #FFDE59, #70CE88, #5E9CF5, #9B87F5, #D069C3)",
  }
];

export const getIdentityById = (id: string | undefined): PrideIdentity | undefined => {
  if (!id) return undefined;
  if (id === "none") return undefined;
  return prideIdentities.find(identity => identity.id === id);
};

export const getIdentityGradient = (id: string | undefined): string => {
  if (id === "none" || !id) {
    // Default rainbow gradient for no selection or "none" value
    return "linear-gradient(45deg, #FF5757, #FF914D, #FFDE59, #70CE88, #5E9CF5, #9B87F5, #D069C3)";
  }
  const identity = getIdentityById(id);
  return identity?.flagGradient || "linear-gradient(45deg, #FF5757, #FF914D, #FFDE59, #70CE88, #5E9CF5, #9B87F5, #D069C3)";
};
