terraform {
  backend "s3" {
    bucket = "terraform-state-jamar"
    key    = "state/front/proyectoservicio/"
    region = "us-east-1"
  }
}
