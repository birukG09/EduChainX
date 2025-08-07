#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod edu_chain_x {
    use ink::storage::Mapping;

    #[derive(scale::Encode, scale::Decode, Clone, Debug, PartialEq, Eq)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct Certificate {
        student_name: String,
        course: String,
        institution: String,
        issued_date: u64,
        is_revoked: bool,
    }

    #[ink(storage)]
    pub struct EduChainX {
        certificates: Mapping<AccountId, Certificate>,
        owner: AccountId,
    }

    impl EduChainX {
        #[ink(constructor)]
        pub fn new() -> Self {
            let owner = Self::env().caller();
            Self {
                certificates: Mapping::default(),
                owner,
            }
        }

        #[ink(message)]
        pub fn issue_certificate(
            &mut self,
            student: AccountId,
            name: String,
            course: String,
            institution: String,
            issued_date: u64,
        ) -> bool {
            self.only_owner();
            let cert = Certificate {
                student_name: name,
                course,
                institution,
                issued_date,
                is_revoked: false,
            };
            self.certificates.insert(student, &cert);
            true
        }

        #[ink(message)]
        pub fn get_certificate(&self, student: AccountId) -> Option<Certificate> {
            self.certificates.get(student)
        }

        #[ink(message)]
        pub fn revoke_certificate(&mut self, student: AccountId) -> bool {
            self.only_owner();
            if let Some(mut cert) = self.certificates.get(student) {
                cert.is_revoked = true;
                self.certificates.insert(student, &cert);
                true
            } else {
                false
            }
        }

        #[ink(message)]
        pub fn is_owner(&self) -> bool {
            self.env().caller() == self.owner
        }

        fn only_owner(&self) {
            assert_eq!(self.env().caller(), self.owner, "Only owner can call this");
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn test_issue_and_revoke() {
            let mut contract = EduChainX::new();
            let student = AccountId::from([0x1; 32]);
            let issued = contract.issue_certificate(
                student,
                "Alice".to_string(),
                "Blockchain 101".to_string(),
                "BITS".to_string(),
                20250807,
            );
            assert!(issued);

            let cert = contract.get_certificate(student).unwrap();
            assert_eq!(cert.student_name, "Alice");
            assert_eq!(cert.is_revoked, false);

            let revoked = contract.revoke_certificate(student);
            assert!(revoked);

            let cert = contract.get_certificate(student).unwrap();
            assert!(cert.is_revoked);
        }
    }
}
