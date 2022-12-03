using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace api.Dto
{
  public class ServiceResponse<T>
  {
    [DataMember(Name="data")]
    public T? Data { get; set; }
    
    [DataMember(Name="message")]
    public string Message { get; set; } = string.Empty;

    [DataMember(Name="success")]
    public bool Success { get; set; } = false;
  }
}