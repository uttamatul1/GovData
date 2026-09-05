/**
 * CLI entry point for data validation.
 * Usage: npx tsx src/scripts/validate.ts
 */
import { allMetrics } from '../data/index';
import { runValidationCLI } from '../utils/validateData';

runValidationCLI(allMetrics);
