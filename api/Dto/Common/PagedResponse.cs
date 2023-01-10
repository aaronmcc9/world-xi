using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace api.Dto.Common
{

  [DataContract]
  public class PagedResponseDto<T>
  {
    [DataMember(Name ="items")]
    public IEnumerable<T> Items { get; set; } = new T[0];
    
    [DataMember(Name ="total")]
    public int Total { get; set; }
  }
}