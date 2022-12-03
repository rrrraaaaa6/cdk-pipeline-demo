# replace this



```mermaid
flowchart TB
  App---S(Stack)
  S--- C1(Instance)
  C1---C2(CfnInstance)
  C1---C3(CfnSecurityGroup)
  S--- C4(Vpc)
  C4---C5(CfnVpc)
  C4---C6(CfnSubnet)
```
