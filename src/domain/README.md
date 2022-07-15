# Domain Layer

Keep the Entity and Value Objects

# Naming Convention

## Value Object

Ends with `Value`

Example: 
- NearNetworkValue.ts
- DisplayNameValue.ts

## Entity Id (is also a Value Object)

Ends with `Id`

Example: 
- NearId.ts
- ContractId.ts


## Entity

The name

Example: 
- NearNetworkValue.ts
- DisplayNameValue.ts


## Repository Interface

Start with `I` and ends with `Repo`

Should contain the interface for repository only. Implementation is in the `infrastructure` layer.

Example:
- ILiffRepo.ts
- INearRepo.ts
