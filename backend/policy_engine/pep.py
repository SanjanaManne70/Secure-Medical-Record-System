from policy_engine.pdp import is_access_allowed

def enforce_policy(patient, doctor):
    if not is_access_allowed(doctor, patient):
        raise PermissionError("Access denied by policy engine")
