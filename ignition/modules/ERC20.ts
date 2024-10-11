import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ErcModule = buildModule("ErcModule", (t) => {
  const erc = t.contract("DLToken");

  return { erc };
});

export default ErcModule;
