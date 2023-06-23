import { PatientInfoContainer } from "@/modules/patients/csvUtils/interface";
import { Sex } from "@/modules/patients/csvUtils/enum";

const observationData: PatientInfoContainer = {
  patientData: [
    {
      patient_ssn: "173-56-7224",
      patient_firstname: "Barry",
      patient_lastname: "Gibberd",
      patient_country: "Philippines",
      patient_address1: "1 Old Shore Way",
      patient_address2: "Room 1090",
      patient_number1: "263-634-6572",
      patient_number2: "827-584-6788",
      patient_sex: Sex.M,
      patient_dob: new Date("1990-02-23T18:15:00.000Z"),
      patient_dod: new Date("2026-05-01T18:15:00.000Z"),
      patient_email: "bgibberd7@techcrunch.com",
      patient_height: 5.1,
      patient_weight: 112,
      patient_bloodtype: "B-",
      patient_education_background: "Bachelors",
      patient_occupation: "Retired",
    },
  ],
  hospitalData: [
    {
      hospital_id: "01GR8W6HWN9H3RWVWGJ9BEEBCB",
      hospital_name: "Lakin Inc",
      hospital_address: "60767 Hoffman Hill",
      hospital_email: "ddallaghan0@businessweek.com",
      hospital_number: "483-865-0493",
    },
  ],
  medicationData: [
    {
      medication_id: "4b796951-6841-4e34-a5d4-274653ddd12c",
      medication_company: "Jones Inc",
      medication_level: 4,
      medication_name: "Levofloxacin",
      medication_remark:
        "Phasellus in felis. Donec semper sapien a libero. Nam dui.Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.",
    },
  ],

  nurseData: [
    {
      nurse_id: "3d45eb7a-4953-48af-9ad5-675583aac9b0",
      nurse_firstname: "Delilah",
      nurse_lastname: "Issard",
      nurse_address1: "711 Carpenter Avenue",
      nurse_address2: "Apt 286",
      nurse_number1: "669-185-4158",
      nurse_checkIn: new Date("2041-08-28T14:30:00.000Z"),
      nurse_checkOut: new Date("2041-08-29T12:20:00.000Z"),
    },
  ],
  observationData: [
    {
      observation_id: "4f4389fe-251a-46db-a491-ac80c4a3c82e",
      observation_date: new Date("2044-12-30T12:30:00.000Z"),
      observation_time: new Date("2044-12-31T01:50:00.000Z"),
      observation_remark:
        "Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.",
      patient_ssn: "430-50-7456",
      practitioner_id: "9c0806a4-3557-4fcc-80c1-a61644741096",
      nurse_id: "3d45eb7a-4953-48af-9ad5-675583aac9b0",
      medication_id: "4b796951-6841-4e34-a5d4-274653ddd12c",
      hospital_id: "01GR8W6HWN9H3RWVWGJ9BEEBCB",
    },
  ],
  practitionerData: [
    {
      practitioner_id: "9c0806a4-3557-4fcc-80c1-a61644741096",
      practitioner_firstname: "Erskine",
      practitioner_lastname: "Gutteridge",
      practitioner_address1: "095 Barby Alley",
      practitioner_address2: "PO Box 2482",
      practitioner_number1: "366-178-9382",
      practitioner_number2: "889-927-6699",
      practitioner_checkin: new Date("2043-11-14T01:22:00.000Z"),
      practitioner_checkout: new Date("2043-11-14T10:17:00.000Z"),
    },
  ],
};

export { observationData };
