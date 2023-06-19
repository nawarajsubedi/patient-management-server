import { validateSignup, validateSignin } from "../validator";
import { Request, Response, NextFunction } from "express";

// export const validation = (req: Request, res: Response, next: NextFunction) => {
//   let error;

//   switch (req.url) {
//     case "/signup":
//       ({ error } = validateSignup(req.body));
//       break;
//     case "/signin":
//       ({ error } = validateSignin(req.body));
//       break;
//     default:
//       break;
//   }

//   if (error) {
//     return res.status(422).json({ message: error.details });
//   } else {
//     next();
//   }
// };

export const signinValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = validateSignin(req.body);

  if (error) {
    return res.status(422).json({ message: error.details });
  } else {
    next();
  }
};

export const signupValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = validateSignup(req.body);

  if (error) {
    return res.status(422).json({ message: error.details });
  } else {
    next();
  }
};
