- TODO: Don't re-perform validation if fields are already valid
- TODO: Don't update feedback on unchanged fields (isEqual initialValue)
- TODO: Validate on useForm mount
- TODO: Field should accept a prop with an array of fieldNames and rerender when these fields are also rerenders (sync re-rerenders)

# minimal update:

- Option for values instead of undefined
- don't show success on untouched fields (but show error, validating)
- don't show validating / success on untouched fields
- make onSubmit always async. if a field needs to be validated in async, don't display async loader

# Done

- Remove lazy initialValue (enabled expensive operation, better to be in useMemo, as we need to check if initial value changed)
- Simplify onSuccess / onFailure logic
- Add setInitialValues?
