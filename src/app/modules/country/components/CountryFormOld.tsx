import { useForm } from "react-hook-form";
import { Country } from '../models/country.ts';
import { useEffect } from "react";
import { logFormErrors } from "@/lib/formUtils.ts";

const CountryFormOld = ({ initialData = new Country(), onSubmit, submitLabel = 'Submit' }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: initialData,
    mode: "onChange"
  });

  const formValues = watch(); // watch entire form

  useEffect(() => {
    logFormErrors(errors);
  }, [formValues, errors]); // Run when values or errors change

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ marginTop: '20px', display: "flex" }}>
        <label>Name (English): </label>
        <input {...register("nameEn", { required: "English name is required." })} />
        {errors.nameEn && <div style={{ color: 'red' }}>&nbsp; {errors.nameEn.message}</div>}
      </div>
      <div style={{ marginTop: '20px', display: "flex" }}>
        <label>Name (Bengali): </label>
        <input {...register("nameBn", { required: "Bengali name is required." })} />
        {errors.nameBn && <div style={{ color: 'red' }}>&nbsp; {errors.nameBn.message}</div>}
      </div>
      <div style={{ marginTop: '20px', display: "flex" }}>
        <label>Name (Arabic): </label>
        <input {...register("nameAr", { required: "Arabic name is required." })} />
        {errors.nameAr && <div style={{ color: 'red' }}>&nbsp; {errors.nameAr.message}</div>}
      </div>
      <div style={{ marginTop: '20px', display: "flex" }}>
        <label>Name (Hindi): </label>
        <input {...register("nameHi", { required: "Hindi name is required." })} />
        {errors.nameHi && <div style={{ color: 'red' }}>&nbsp; {errors.nameHi.message}</div>}
      </div>
      <button style={{ marginTop: '20px', display: "flex" }} type="submit">{submitLabel}</button>
    </form>
  );
};

export default CountryFormOld;
